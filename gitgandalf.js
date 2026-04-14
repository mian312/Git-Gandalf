const { runLLM } = require("./llm/runner");
const { extractMetadata } = require("./diffMetadata");
const { buildPrompt } = require("./llm/prompt");
const { renderReview } = require("./renderer/terminal");
const { normalizeJudgment } = require("./llm/normalize");
const { decidePolicy } = require("./policy/decision");
const { getExitCode } = require("./policy/exit");

const MAX_DIFF_SIZE = 200 * 1024;

async function main() {
  let input = "";

  process.stdin.setEncoding("utf8");

  for await (const chunk of process.stdin) {
    input += chunk;
  }

  if (!input.trim()) {
    console.log("Git Gandalf Review\nNo staged changes detected. Skipping analysis.");
    process.exit(0);
  }

  if (Buffer.byteLength(input, "utf8") > MAX_DIFF_SIZE) {
    console.error("Git Gandalf Review\nDiff too large to process safely.");
    process.exit(1);
  }

  const metadata = extractMetadata(input);
  const prompt = buildPrompt(metadata, input);

  let llmOutput;

  try {
    llmOutput = await runLLM(prompt);
  } catch (err) {
    console.error("Git Gandalf Review\nLLM execution failed.");
    process.exit(1);
  }

  let normalized;

  try {
    normalized = normalizeJudgment(llmOutput);
  } catch (err) {
    // Fallback: unable to parse LLM response, default to WARN to avoid false positives
    console.warn(`Git Gandalf Review\nWarning: Could not parse LLM response: ${err.message}`);
    normalized = {
      risk: "MEDIUM",
      issues: ["Failed to parse LLM response - manual review recommended"],
      summary: `LLM output parse error: ${err.message}`
    };
  }

  const decisionResult = decidePolicy(normalized);

  const output = renderReview(decisionResult);

  console.log(output);

  const exitCode = getExitCode(decisionResult.decision);
  process.exit(exitCode);
}

main();