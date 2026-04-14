const { runLLM } = require("./llm/runner");
const { extractMetadata, filterBinaryFiles } = require("./diffMetadata");
const { buildPrompt } = require("./llm/prompt");
const { renderReview } = require("./renderer/terminal");
const { normalizeJudgment } = require("./llm/normalize");
const { decidePolicy } = require("./policy/decision");
const { getExitCode } = require("./policy/exit");
const { createFailureJudgment } = require("./policy/failure");

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

  let metadata;
  let filteredDiff;

  try {
    metadata = extractMetadata(input);
    filteredDiff = filterBinaryFiles(input);
  } catch (err) {
    console.error("Git Gandalf Review\nFailed to parse diff:", err.message);
    process.exit(1);
  }

  const prompt = buildPrompt(metadata, filteredDiff);

  let normalized;

  try {
    const llmOutput = await runLLM(prompt);

    try {
      normalized = normalizeJudgment(llmOutput);
    } catch (err) {
      normalized = createFailureJudgment("INVALID_LLM_OUTPUT", err);
    }

  } catch (err) {
    if (err.message && err.message.toLowerCase().includes("timeout")) {
      normalized = createFailureJudgment("LLM_TIMEOUT", err);
    } else {
      normalized = createFailureJudgment("LLM_UNAVAILABLE", err);
    }
  }

  let decisionResult;

  try {
    decisionResult = decidePolicy(normalized);
  } catch (err) {
    const fallback = createFailureJudgment("INTERNAL_ERROR", err);
    decisionResult = decidePolicy(fallback);
  }

  const output = renderReview(decisionResult);
  console.log(output);

  const exitCode = getExitCode(decisionResult.decision);
  process.exit(exitCode);
}

main();