#!/usr/bin/env node

const MAX_DIFF_SIZE = 2 * 1024; // 200 KB

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';

    process.stdin.setEncoding('utf8');

    process.stdin.on('data', chunk => {
      data += chunk;

      // Guardrail: early size check
      if (data.length > MAX_DIFF_SIZE) {
        reject(new Error('Diff too large'));
        process.stdin.pause();
      }
    });

    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', err => reject(err));
  });
}

function normalizeDiff(diff) {
  return diff.replace(/\r\n/g, '\n').trim();
}

(async function main() {
  try {
    let rawDiff = await readStdin();

    if (!rawDiff || rawDiff.trim() === '') {
      console.log(
        "🧙 Git Gandalf Review\nNo staged changes detected. Skipping analysis."
      );
      process.exit(0);
    }

    const diff = normalizeDiff(rawDiff);

    if (diff.length === 0) {
      console.log(
        "🧙 Git Gandalf Review\nNo meaningful changes detected."
      );
      process.exit(0);
    }

    console.log("🧙 Git Gandalf Review (no analysis yet)");

    process.exit(0);

  } catch (err) {
    if (err.message === 'Diff too large') {
      console.error(
        "🧙 Git Gandalf Review\n❌ Diff exceeds size limit. Commit blocked."
      );
    } else {
      console.error(
        "🧙 Git Gandalf Review\n❌ Failed to read diff safely."
      );
    }

    process.exit(1); // FAIL CLOSED
  }
})();