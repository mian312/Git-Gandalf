const { runLLM } = require("./llm/runner");
const { extractMetadata } = require("./diffMetadata");
const { buildPrompt } = require("./llm/prompt");

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

  console.log("Git Gandalf Raw LLM Output:\n");
  console.log(llmOutput);
}

main();