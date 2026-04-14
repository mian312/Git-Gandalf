function createFailureJudgment(type, error) {
  switch (type) {
    case "LLM_UNAVAILABLE":
      return {
        risk: "MEDIUM",
        issues: ["LLM unavailable - skipping deep analysis"],
        summary: "Could not run AI review. Proceed with caution."
      };

    case "LLM_TIMEOUT":
      return {
        risk: "MEDIUM",
        issues: ["LLM timed out"],
        summary: "AI review timed out. Proceed with caution."
      };

    case "INVALID_LLM_OUTPUT":
      return {
        risk: "HIGH",
        issues: ["Malformed AI response"],
        summary: "AI output invalid. Blocking commit for safety."
      };

    case "INTERNAL_ERROR":
      return {
        risk: "HIGH",
        issues: ["Internal system error"],
        summary: "Unexpected failure. Blocking commit."
      };

    default:
      return {
        risk: "HIGH",
        issues: ["Unknown failure"],
        summary: "Unknown error occurred."
      };
  }
}

module.exports = { createFailureJudgment };