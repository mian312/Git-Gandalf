function extractMetadata(diffText) {
  if (!diffText || typeof diffText !== "string") {
    throw new Error("Invalid diff input");
  }

  const lines = diffText.split("\n");

  const filesSet = new Set();
  let linesAdded = 0;
  let linesRemoved = 0;

  let isBinaryFile = false;

  for (let line of lines) {
    // Detect binary diff
    if (line.includes("Binary files") && line.includes("differ")) {
      isBinaryFile = true;
      continue;
    }

    // Detect file names
    if (line.startsWith("diff --git")) {
      isBinaryFile = false;

      const match = line.match(/a\/(.+?) b\/(.+)/);
      if (match) {
        const filePath = match[2];
        filesSet.add(filePath);
      }
    }

    // Skip binary sections
    if (isBinaryFile) continue;

    // Count additions (ignore +++)
    if (line.startsWith("+") && !line.startsWith("+++")) {
      linesAdded++;
    }

    // Count deletions (ignore ---)
    if (line.startsWith("-") && !line.startsWith("---")) {
      linesRemoved++;
    }
  }

  return {
    files_changed: filesSet.size,
    files: Array.from(filesSet),
    lines_added: linesAdded,
    lines_removed: linesRemoved,
  };
}

module.exports = { extractMetadata };