/**
 * Chat Service — context-aware environmental assistant for India.
 *
 * Responsibilities:
 *  1. Fetch environmental context for a region from the DB
 *  2. Build a structured prompt and call the Gemini LLM
 *  3. Parse the LLM response into a typed StructuredResponse
 *  4. Fall back to the rule-based system when the LLM is unavailable
 */

import { PrismaClient } from '@prisma/client';
import { matchIndiaPollutionReply, ChatPayload } from '../static/indiaPollutionChat';

const prisma = new PrismaClient();

// ────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────

export interface ChatInput {
  userQuery: string;
  regionId?: number;
}

export interface CauseItem {
  type: 'local' | 'seasonal' | 'global';
  description: string;
}

export interface SolutionItem {
  level: 'government' | 'community' | 'individual';
  action: string;
}

/** Structured output from the LLM */
export interface StructuredResponse {
  answer: string;
  causes: CauseItem[];
  prediction: string;
  solutions: SolutionItem[];
}

/** Full response returned to the controller (includes legacy format + metadata) */
export interface ChatServiceResponse {
  structured: StructuredResponse;
  legacy: ChatPayload;
  source: 'llm' | 'rule-based';
  /** Present when source='rule-based' due to an LLM failure */
  fallbackReason?: string;
}

// ────────────────────────────────────────────────────────────────────
// System Prompt
// ────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an environmental expert focused on India.
You have deep knowledge of pollution, climate change, deforestation, water quality, and land markets across Indian cities — especially the Meerut–NCR belt in Uttar Pradesh.

Always answer in this structure:
1. **Direct Answer** — concise, factual answer to the user's question
2. **Key Causes** — categorized as Local, Seasonal, and Global factors
3. **Impact on India** — specific consequences for Indian communities, health, economy
4. **Future Prediction** — data-driven outlook for the next 5-10 years
5. **Suggested Solutions** — actionable steps at government, community, and individual levels

Rules:
- Use real-world reasoning grounded in Indian geography and climate.
- Reference specific cities, rivers, and policies when relevant.
- Avoid generic or overly broad answers.
- If environmental data context is provided, use it to make your answer specific.
- Do NOT hallucinate data — if you are unsure, say so.
- Keep answers India-specific unless asked otherwise.
- Return your response as valid JSON with this exact structure:
{
  "answer": "Your direct answer as a detailed paragraph",
  "causes": [
    { "type": "local", "description": "..." },
    { "type": "seasonal", "description": "..." },
    { "type": "global", "description": "..." }
  ],
  "prediction": "Future outlook paragraph",
  "solutions": [
    { "level": "government", "action": "..." },
    { "level": "community", "action": "..." },
    { "level": "individual", "action": "..." }
  ]
}
Return ONLY the JSON object, no markdown fences or extra text.`;

// ────────────────────────────────────────────────────────────────────
// Context fetcher
// ────────────────────────────────────────────────────────────────────

async function fetchRegionContext(regionId: number): Promise<string> {
  try {
    const region = await prisma.region.findUnique({
      where: { regionId },
      include: {
        environmentalCauses: true,
        landMarketData: { orderBy: { year: 'desc' }, take: 1 },
        landPricePredictions: { orderBy: { year: 'desc' }, take: 1 },
        historicalData: { orderBy: { year: 'desc' }, take: 1 },
      },
    });

    if (!region) return '';

    const latest = region.landMarketData[0];
    const pred = region.landPricePredictions[0];
    const hist = region.historicalData[0];
    const causes = region.environmentalCauses
      .map(
        (c) =>
          `- [${c.factorType}] ${c.title}: ${c.description} (impact: ${c.impactScore}/100)`
      )
      .join('\n');

    return `
REGION CONTEXT for ${region.name} (${region.type}):
${region.description}
Location: ${region.latitude}°N, ${region.longitude}°E | Area: ${region.areaSqkm} sq km

Environmental Data (latest):
- Temperature: ${hist?.temperatureCelsius ?? 'N/A'}°C
- Precipitation: ${hist?.precipitationMm ?? 'N/A'} mm/yr
- AQI: ${latest?.aqi ?? 'N/A'}
- Green Cover: ${latest?.greenCoverPercent ?? 'N/A'}%
- Water Quality Index: ${latest?.waterQualityIndex ?? 'N/A'}/100
- Flood Risk: ${latest?.floodRiskScore ?? 'N/A'}/100
- Land Price: ₹${latest?.avgPricePerSqft ?? 'N/A'}/sq ft
- Predicted Price (2035): ₹${pred?.predictedPricePerSqft ?? 'N/A'}/sq ft
- Environmental Score: ${pred?.environmentalScore ?? 'N/A'}/100

Environmental Causes:
${causes || 'No specific causes recorded.'}
`;
  } catch (err) {
    console.warn('Failed to fetch region context:', err);
    return '';
  }
}

// ────────────────────────────────────────────────────────────────────
// Gemini API caller with smart retry logic
// ────────────────────────────────────────────────────────────────────

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Custom error class so we can carry a user-friendly reason. */
class GeminiError extends Error {
  readonly userReason: string;
  constructor(message: string, userReason: string) {
    super(message);
    this.name = 'GeminiError';
    this.userReason = userReason;
  }
}

/**
 * Check if a 429 response body indicates *quota exhaustion* (daily limit)
 * vs. a temporary per-minute rate-limit burst.
 */
function isQuotaExhausted(responseBody: string): boolean {
  const lower = responseBody.toLowerCase();
  return (
    lower.includes('quota') ||
    lower.includes('resource_exhausted') ||
    lower.includes('rate limit exceeded') ||
    lower.includes('daily limit')
  );
}

async function callGemini(
  userQuery: string,
  context: string
): Promise<StructuredResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new GeminiError('GEMINI_API_KEY not set', 'API key is not configured.');

  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const userPrompt = context
    ? `${context}\n\nUser Question: ${userQuery}`
    : `User Question: ${userQuery}`;

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT + '\n\n' + userPrompt }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  };

  // Retry up to 3 times with exponential backoff for transient 429 errors.
  // Skip retries entirely when the daily quota is exhausted.
  const maxRetries = 3;
  let lastError: GeminiError | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (attempt > 0) {
      const delayMs = Math.min(1000 * Math.pow(2, attempt), 8000);
      console.log(`⟳  Gemini retry ${attempt}/${maxRetries} after ${delayMs}ms…`);
      await sleep(delayMs);
    }

    let resp: globalThis.Response;
    try {
      resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (networkErr: any) {
      // Network failure (DNS, timeout, etc.) — no point retrying fast
      throw new GeminiError(
        `Network error calling Gemini: ${networkErr.message}`,
        'Unable to reach the AI service. Check your internet connection.'
      );
    }

    if (resp.status === 429) {
      const errBody = await resp.text();

      if (isQuotaExhausted(errBody)) {
        // Daily quota gone – retrying won't help
        console.warn('✗  Gemini daily quota exhausted — skipping retries.');
        throw new GeminiError(
          `Gemini API quota exhausted: ${errBody}`,
          'AI service daily quota is exhausted. Using offline knowledge base instead.'
        );
      }

      // Transient burst rate-limit — worth retrying
      lastError = new GeminiError(
        `Rate limited (429), attempt ${attempt + 1}/${maxRetries}`,
        'AI service is temporarily busy. Retrying…'
      );
      console.warn(`⚠  ${lastError.message}`);
      continue;
    }

    if (resp.status === 403) {
      const errBody = await resp.text();
      throw new GeminiError(
        `Gemini API 403: ${errBody}`,
        'API key is invalid or does not have permission. Please check your GEMINI_API_KEY.'
      );
    }

    if (!resp.ok) {
      const errText = await resp.text();
      throw new GeminiError(
        `Gemini API error ${resp.status}: ${errText}`,
        `AI service returned an error (HTTP ${resp.status}). Using offline knowledge base.`
      );
    }

    const data: any = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new GeminiError('Empty Gemini response', 'AI returned an empty response.');

    // Strip markdown fences and parse JSON
    const cleaned = text
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    const parsed = JSON.parse(cleaned) as StructuredResponse;

    // Validate required fields exist
    if (!parsed.answer || !Array.isArray(parsed.causes) || !parsed.prediction || !Array.isArray(parsed.solutions)) {
      throw new GeminiError('LLM response missing required fields', 'AI response was malformed.');
    }

    return parsed;
  }

  // All retries exhausted
  throw lastError || new GeminiError(
    'Gemini API failed after retries',
    'AI service is unavailable after multiple attempts. Using offline knowledge base.'
  );
}

// ────────────────────────────────────────────────────────────────────
// Convert StructuredResponse → legacy ChatPayload (frontend compat)
// ────────────────────────────────────────────────────────────────────

function toLegacyFormat(llm: StructuredResponse): ChatPayload {
  const causesHtml = llm.causes
    .map(
      (c) =>
        `<li><strong>[${c.type}]</strong> ${c.description}</li>`
    )
    .join('');

  const details = `
    <div>
      <p>${llm.answer}</p>
      ${causesHtml ? `<h4 style="margin-top:12px;">Key Causes</h4><ul>${causesHtml}</ul>` : ''}
      ${llm.prediction ? `<h4 style="margin-top:12px;">Future Prediction</h4><p>${llm.prediction}</p>` : ''}
    </div>
  `;

  const sources = llm.causes.map((c) => ({
    name: `${c.type.charAt(0).toUpperCase() + c.type.slice(1)} Factor`,
    percentage: Math.round(100 / (llm.causes.length || 1)),
  }));

  const solutions: { government: string[]; community: string[]; individual: string[] } = {
    government: [],
    community: [],
    individual: [],
  };
  for (const s of llm.solutions) {
    if (solutions[s.level]) solutions[s.level].push(s.action);
  }

  return { details, sources, solutions };
}

// ────────────────────────────────────────────────────────────────────
// Public API — the main service method
// ────────────────────────────────────────────────────────────────────

/**
 * Process a user chat query.
 *
 * 1. Try calling the Gemini LLM with region context.
 * 2. On failure, fall back to the rule-based response system.
 */
export async function processChat(input: ChatInput): Promise<ChatServiceResponse> {
  const { userQuery, regionId } = input;
  const hasApiKey = !!process.env.GEMINI_API_KEY;
  let fallbackReason: string | undefined;

  // ── Try LLM path ──
  if (hasApiKey) {
    try {
      const context = regionId ? await fetchRegionContext(regionId) : '';
      const structured = await callGemini(userQuery, context);
      const legacy = toLegacyFormat(structured);

      return { structured, legacy, source: 'llm' };
    } catch (err: any) {
      const reason =
        err instanceof GeminiError
          ? err.userReason
          : 'AI service encountered an unexpected error.';
      console.warn('Gemini API failed, falling back to rule-based system:', err.message || err);
      fallbackReason = reason;
    }
  } else {
    fallbackReason = 'No API key configured. Using offline knowledge base.';
  }

  // ── Fallback: rule-based ──
  const fallbackPayload = matchIndiaPollutionReply(userQuery);

  // Build a best-effort structured response from the static payload
  const structured: StructuredResponse = {
    answer: fallbackPayload.details.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    causes: fallbackPayload.sources.map((s) => ({
      type: 'local' as const,
      description: `${s.name} (${s.percentage}%)`,
    })),
    prediction: 'Prediction unavailable — using cached rule-based data.',
    solutions: [
      ...fallbackPayload.solutions.government.map((a) => ({
        level: 'government' as const,
        action: a,
      })),
      ...fallbackPayload.solutions.community.map((a) => ({
        level: 'community' as const,
        action: a,
      })),
      ...fallbackPayload.solutions.individual.map((a) => ({
        level: 'individual' as const,
        action: a,
      })),
    ],
  };

  return { structured, legacy: fallbackPayload, source: 'rule-based', fallbackReason };
}
