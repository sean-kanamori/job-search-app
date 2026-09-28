"use server";

import * as cheerio from "cheerio";
import { createClient } from "@/lib/supabase/server";
import { extractJobPosting, type ParsedJobPosting } from "@/lib/anthropic";

export type ParseJobUrlResult =
  | { data: ParsedJobPosting & { source: string | null } }
  | { error: string };

// Aggregator job boards — anything else is treated as the company's own
// site (including ATS platforms like Greenhouse/Lever, which are
// embedded on a company's career page even though the domain differs).
const JOB_BOARD_HOSTNAMES = [
  "indeed.com",
  "ziprecruiter.com",
  "monster.com",
  "glassdoor.com",
  "dice.com",
  "simplyhired.com",
  "careerbuilder.com",
];

/** Guesses the "Source" dropdown value from the job URL's hostname.
 * Matches the exact option strings in application-fields.tsx. */
function guessSourceFromUrl(url: string): string | null {
  let hostname: string;
  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
  if (hostname.includes("linkedin.com")) return "LinkedIn";
  if (JOB_BOARD_HOSTNAMES.some((d) => hostname.includes(d))) {
    return "Other job board";
  }
  return "Company website";
}

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

async function fetchWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      // Redirects are followed manually below, one hop at a time —
      // letting fetch auto-follow them can hang indefinitely on some
      // redirect chains rather than failing fast.
      redirect: "manual",
      headers: { "User-Agent": USER_AGENT },
    });
  } finally {
    clearTimeout(timeout);
  }
}

/** Follows redirects manually, one hop at a time, each with its own
 * timeout, up to a small hop limit — more robust than trusting the
 * runtime's automatic redirect-following, which can hang on certain
 * chains instead of failing fast. */
async function fetchFollowingRedirects(startUrl: string, timeoutMs: number) {
  let currentUrl = startUrl;
  for (let hop = 0; hop < 5; hop++) {
    const response = await fetchWithTimeout(currentUrl, timeoutMs);
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return response;
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }
    return response;
  }
  throw new Error("Too many redirects.");
}

export async function parseJobUrl(url: string): Promise<ParseJobUrlResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return { error: "That doesn't look like a valid URL." };
  }
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return { error: "Only http/https URLs are supported." };
  }

  let html: string;
  try {
    const response = await fetchFollowingRedirects(parsedUrl.toString(), 10000);
    if (!response.ok) {
      return {
        error: `That page returned an error (${response.status}). Try pasting the details in manually.`,
      };
    }
    html = await response.text();
  } catch {
    return { error: "Couldn't reach that URL. Try pasting the details in manually." };
  }

  const $ = cheerio.load(html);
  $("script, style, noscript, nav, footer, header, svg, iframe").remove();
  const text = $("body").text().replace(/\s+/g, " ").trim();

  // A real job posting page has real content. A near-empty result
  // usually means the page needed JavaScript or a login to render —
  // common on LinkedIn/Indeed — and sending that to Claude would just
  // produce a hallucinated guess instead of an honest failure.
  if (text.length < 200) {
    return {
      error:
        "Couldn't read this page — it may require sign-in or JavaScript to view. Try pasting the details in manually.",
    };
  }

  try {
    const data = await extractJobPosting(text.slice(0, 15000));
    return { data: { ...data, source: guessSourceFromUrl(parsedUrl.toString()) } };
  } catch {
    return {
      error: "Couldn't extract job details from that page. Try pasting them in manually.",
    };
  }
}
