const { runLLM } = require("./llm/runner");
const { extractMetadata } = require("./diffMetadata");

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

  if (input.length > MAX_DIFF_SIZE) {
    console.error("Git Gandalf Review\nERROR: Diff too large");
    process.exit(1);
  }

  const normalized = input.replace(/\r\n/g, "\n");

  try {
    // ✅ Ticket 4 integration
    const metadata = extractMetadata(normalized);

    // ✅ Send BOTH metadata + raw diff
    const prompt =
      "DIFF METADATA:\n" +
      JSON.stringify(metadata, null, 2) +
      "\n\nRAW DIFF:\n" +
      normalized;

    const response = await runLLM(prompt);

    console.log("Git Gandalf Review (LLM Output)\n");
    console.log(response);

    process.exit(0);
  } catch (err) {
    if (err.message === "LLM_TIMEOUT") {
      console.log("Git Gandalf Review\nWARN: LLM timed out");
      process.exit(0);
    }

    if (err.message === "LLM_NOT_RUNNING") {
      console.log("Git Gandalf Review\nWARN: Ollama is not running");
      process.exit(0);
    }

    if (err.message === "LLM_INVALID_RESPONSE") {
      console.error("Git Gandalf Review\nERROR: Invalid LLM response");
      process.exit(1);
    }

    console.error("Git Gandalf Review\nERROR:", err.message);
    process.exit(1);
  }
}

main();