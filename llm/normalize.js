function extractJSON(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch {
        // TODO
      }
    }

    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(raw.substring(start, end + 1));
      } catch {
        // Give up
      }
    }

    throw new Error("Could not extract valid JSON from LLM output");
  }
}

function normalizeJudgment(raw) {
  let parsed = extractJSON(raw);

  const { risk, issues, summary } = parsed;

  if (!["LOW", "MEDIUM", "HIGH"].includes(risk)) {
    throw new Error("Invalid risk");
  }

  if (!Array.isArray(issues)) {
    throw new Error("Issues must be array");
  }

  if (typeof summary !== "string") {
    throw new Error("Summary must be string");
  }

  return { risk, issues, summary };
}

module.exports = { normalizeJudgment, extractJSON };