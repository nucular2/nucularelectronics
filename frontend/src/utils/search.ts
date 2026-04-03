export type SearchItem = {
  id: string;
  label: string;
  text: string;
};

function normalizeBase(value: string) {
  return value
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenizeQuery(query: string) {
  const q = normalizeBase(query);
  if (!q) return [];
  return q.split(" ").filter(Boolean);
}

function includesAllTokens(haystack: string, tokens: string[]) {
  for (const t of tokens) {
    if (!haystack.includes(t)) return false;
  }
  return true;
}

function scoreText(haystack: string, tokens: string[]) {
  let score = 0;
  for (const t of tokens) {
    const idx = haystack.indexOf(t);
    if (idx === -1) return 0;
    score += idx === 0 ? 6 : idx < 24 ? 4 : idx < 80 ? 2 : 1;
  }
  return score;
}

export function buildSnippet(text: string, tokens: string[], maxLen = 90) {
  const raw = String(text || "").replace(/\s+/g, " ").trim();
  if (!raw) return "";
  if (tokens.length === 0) return raw.slice(0, maxLen);

  const normalized = normalizeBase(raw);
  let first = Infinity;
  for (const t of tokens) {
    const idx = normalized.indexOf(t);
    if (idx !== -1) first = Math.min(first, idx);
  }
  if (!Number.isFinite(first)) return raw.slice(0, maxLen);

  const start = Math.max(0, first - 24);
  const slice = raw.slice(start, start + maxLen);
  const prefix = start > 0 ? "…" : "";
  const suffix = start + maxLen < raw.length ? "…" : "";
  return `${prefix}${slice}${suffix}`;
}

export function searchItems(items: SearchItem[], query: string, limit = 8) {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return [];

  const results = items
    .map((item) => {
      const labelNorm = normalizeBase(item.label);
      const textNorm = normalizeBase(item.text);
      const combined = `${labelNorm} ${textNorm}`.trim();
      if (!includesAllTokens(combined, tokens)) return null;
      const score = scoreText(labelNorm, tokens) * 3 + scoreText(textNorm, tokens);
      return {
        id: item.id,
        label: item.label,
        snippet: buildSnippet(item.text, tokens),
        score,
      };
    })
    .filter(Boolean) as Array<{ id: string; label: string; snippet: string; score: number }>;

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

