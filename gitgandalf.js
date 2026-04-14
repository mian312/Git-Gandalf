const { extractMetadata } = require("./diffMetadata");

const MAX_DIFF_SIZE = 200 * 1024;

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = "";

    process.stdin.setEncoding("utf8");

    process.stdin.on("data", chunk => {
      data += chunk;

      if (data.length > MAX_DIFF_SIZE) {
        reject(new Error("Diff too large"));
      }
    });

    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", err => reject(err));
  });
}

(async () => {
  try {
    const diff = await readStdin();

    if (!diff.trim()) {
      console.log("Git Gandalf Review\nNo staged changes detected. Skipping analysis.");
      process.exit(0);
    }

    const metadata = extractMetadata(diff);

    console.log("Git Gandalf Review");
    console.log(JSON.stringify(metadata, null, 2));

    process.exit(0);
  } catch (err) {
    console.error("Git Gandalf Error:", err.message);
    process.exit(1);
  }
})();