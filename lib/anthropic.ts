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
