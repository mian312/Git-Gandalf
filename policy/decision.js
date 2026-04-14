function decidePolicy(judgment) {
  if (!judgment || typeof judgment !== "object") {
    throw new Error("Invalid judgment input");
  }

  const { risk, issues, summary } = judgment;

  if (!risk || !["LOW", "MEDIUM", "HIGH"].includes(risk)) {
    throw new Error("Invalid or missing risk level");
  }

  let decision;

  switch (risk) {
    case "LOW":
      decision = "ALLOW";
      break;
    case "MEDIUM":
      decision = "WARN";
      break;
    case "HIGH":
      decision = "BLOCK";
      break;
    default:
      // Should never happen due to validation
      throw new Error("Unhandled risk level");
  }

  return {
    decision,
    risk,
    issues: Array.isArray(issues) ? issues : [],
    summary: typeof summary === "string" ? summary : ""
  };
}

module.exports = {
  decidePolicy
};