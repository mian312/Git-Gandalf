#!/usr/bin/env node

/**
 * Git Gandalf - Entry Point (TICKET 1)
 * Responsibilities:
 * - Read from STDIN
 * - Print placeholder output
 * - Exit with code 0
 *
 * Constraints:
 * - No git awareness
 * - No filesystem access
 * - No environment variables
 * - Stateless
 */

let inputData = "";

// Read STDIN
process.stdin.setEncoding("utf-8");

process.stdin.on("data", (chunk) => {
  inputData += chunk;
});

process.stdin.on("end", () => {
  // For now, we ignore inputData (by design)

  console.log("Git Gandalf Review (no analysis yet)");

  process.exit(0);
});

// Handle case where no STDIN is piped
if (process.stdin.isTTY) {
  console.log("Git Gandalf Review (no analysis yet)");
  process.exit(0);
}