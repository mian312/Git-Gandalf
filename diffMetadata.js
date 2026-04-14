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

function filterBinaryFiles(diffText) {
  if (!diffText || typeof diffText !== "string") {
    throw new Error("Invalid diff input");
  }

  const lines = diffText.split("\n");
  const filteredLines = [];
  let skipSection = false;
  let currentFileIsBinary = false;

  for (let line of lines) {
    // Check if this is a new file
    const isDiffLine = line.startsWith("diff --git");
    
    if (isDiffLine) {
      // Reset binary flag for the new file
      currentFileIsBinary = false;
      skipSection = false;
      filteredLines.push(line);
      continue;
    }

    // Check if this is a binary marker
    if (line.includes("Binary files") && line.includes("differ")) {
      currentFileIsBinary = true;
      skipSection = true;
      continue;
    }

    // Only add non-binary content
    if (!skipSection) {
      filteredLines.push(line);
    }
  }

  return filteredLines.join("\n");
}

module.exports = { extractMetadata, filterBinaryFiles };