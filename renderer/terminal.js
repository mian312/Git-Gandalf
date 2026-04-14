function renderReview({ decision, risk, issues, summary }) {
  const header = "Git Gandalf Review";

  let decisionLabel = "";
  let symbol = "";

  switch (decision) {
    case "ALLOW":
      symbol = "✔";
      decisionLabel = "ALLOW";
      break;
    case "WARN":
      symbol = "⚠";
      decisionLabel = "WARN";
      break;
    case "BLOCK":
      symbol = "✖";
      decisionLabel = "BLOCK";
      break;
    default:
      symbol = "?";
      decisionLabel = "UNKNOWN";
  }

  let output = "";

  output += `${symbol} ${header}\n`;
  output += `Risk: ${risk}\n`;
  output += `Decision: ${decisionLabel}\n`;

  if (summary) {
    output += `Summary: ${summary}\n`;
  }

  if (issues && issues.length > 0) {
    output += "Issues:\n";
    for (const issue of issues) {
      output += ` - ${issue}\n`;
    }
  } else {
    output += "Issues: None\n";
  }

  // Extra emphasis for BLOCK
  if (decision === "BLOCK") {
    output += "\nCommit has been blocked due to high risk.\n";
  }

  return output;
}

module.exports = { renderReview };