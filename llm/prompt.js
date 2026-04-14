function buildPrompt(metadata, diff) {
  return `
You are a senior software engineer reviewing a git commit.

Your job is to assess risk in the change.

You MUST respond with ONLY valid JSON. No explanations, no markdown, no extra text.

STRICT OUTPUT FORMAT:
{
  "risk": "LOW | MEDIUM | HIGH",
  "issues": ["string"],
  "summary": "string"
}

RULES:
- "risk" must be exactly one of: LOW, MEDIUM, HIGH
- "issues" must be an array of strings (can be empty)
- "summary" must be a short human-readable sentence
- Do not include any fields outside this schema
- Do not include comments or explanations
- If unsure, choose MEDIUM risk

--- METADATA ---
${JSON.stringify(metadata, null, 2)}

--- DIFF ---
${diff}
`;
}

module.exports = { buildPrompt };