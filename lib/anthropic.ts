import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Lightweight text cleanup/extraction — not complex reasoning, so a
// smaller/faster model than the PO reader's is fine here.
const MODEL = "claude-sonnet-5";

const EXTRACTION_INSTRUCTIONS =
  "Extract the full text content of this resume as clean plain text " +
  "(light markdown is fine — headings for section names, \"-\" for " +
  "bullet points). Preserve all information and the original section " +
  "order. Don't invent, summarize, or omit anything — this is a " +
  "faithful transcription, not a rewrite. Return only the resume " +
  "text, nothing else.";

/** PDF goes straight to Claude, which reads and cleans it up in one pass. */
export async function extractResumeTextFromPdf(
  base64: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 8000,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: base64,
            },
          },
          { type: "text", text: EXTRACTION_INSTRUCTIONS },
        ],
      },
    ],
  });

  return textFromResponse(response);
}

/**
 * DOCX text is extracted locally first (mammoth), then run through
 * Claude for the same cleanup pass — spacing/line breaks from a
 * .docx extraction can be rougher than the source document.
 */
export async function cleanupResumeText(rawText: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 8000,
    messages: [
      {
        role: "user",
        content: `${EXTRACTION_INSTRUCTIONS}\n\nThis text was extracted from a Word document, so spacing and line breaks may be off:\n\n---\n${rawText}\n---`,
      },
    ],
  });

  return textFromResponse(response);
}

function textFromResponse(response: Anthropic.Message): string {
  const block = response.content.find((b) => b.type === "text");
  if (!block || block.type !== "text") {
    throw new Error("Claude returned no text content.");
  }
  return block.text.trim();
}

export type ParsedJobPosting = {
  company: string | null;
  title: string | null;
  location: string | null;
  remote: boolean | null;
  salary_min: number | null;
  salary_max: number | null;
  job_description: string | null;
};

const JOB_POSTING_TOOL: Anthropic.Tool = {
  name: "record_job_posting",
  description: "Record the structured details extracted from a job posting page.",
  input_schema: {
    type: "object",
    properties: {
      company: { type: ["string", "null"], description: "Hiring company's name" },
      title: { type: ["string", "null"], description: "Job title" },
      location: { type: ["string", "null"], description: "City/state or region, if listed" },
      remote: {
        type: ["boolean", "null"],
        description: "true if explicitly remote, false if explicitly on-site/hybrid, null if unclear",
      },
      salary_min: { type: ["number", "null"], description: "Lower end of salary range in USD, if listed" },
      salary_max: { type: ["number", "null"], description: "Upper end of salary range in USD, if listed" },
      job_description: {
        type: ["string", "null"],
        description: "The full job description/responsibilities/requirements text, cleaned up as plain text",
      },
    },
    required: [
      "company",
      "title",
      "location",
      "remote",
      "salary_min",
      "salary_max",
      "job_description",
    ],
  },
};

/**
 * Extracts structured fields from a job posting's page text. Use null
 * for anything not actually present on the page — never guess or
 * invent a value.
 */
export async function extractJobPosting(
  pageText: string
): Promise<ParsedJobPosting> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4000,
    tools: [JOB_POSTING_TOOL],
    tool_choice: { type: "tool", name: "record_job_posting" },
    messages: [
      {
        role: "user",
        content: `Extract the job details from this job posting page's text content. Use null for any field that isn't actually present — don't guess or invent values.\n\n---\n${pageText}\n---`,
      },
    ],
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Claude didn't return structured job data.");
  }
  return toolUse.input as ParsedJobPosting;
}
