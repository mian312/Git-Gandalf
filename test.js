const { extractMetadata, filterBinaryFiles } = require("./diffMetadata");

const binaryDiffSample = `diff --git a/image.png b/image.png
index 1234567..abcdefg 100644
Binary files a/image.png and b/image.png differ
diff --git a/main.js b/main.js
index 1234567..abcdefg 100644
--- a/main.js
+++ b/main.js
@@ -1,3 +1,4 @@
-console.log('old');
+console.log('new');
+console.log('added');`;

const normalDiffSample = `diff --git a/main.js b/main.js
index 1234567..abcdefg 100644
--- a/main.js
+++ b/main.js
@@ -1,3 +1,4 @@
-console.log('old');
+console.log('new');`;

function runTests() {
  console.log("Running tests...\n");
  let passed = 0;
  let failed = 0;

  // Test 1: extractMetadata with normal diff
  try {
    const meta = extractMetadata(normalDiffSample);
    if (meta.files_changed === 1 && meta.lines_added === 1 && meta.lines_removed === 1) {
      console.log("✓ Test 1 PASS: extractMetadata with normal diff");
      passed++;
    } else {
      console.log("✗ Test 1 FAIL: extractMetadata metadata incorrect", meta);
      failed++;
    }
  } catch (err) {
    console.log("✗ Test 1 FAIL: extractMetadata threw error:", err.message);
    failed++;
  }

  // Test 2: extractMetadata with binary files
  try {
    const meta = extractMetadata(binaryDiffSample);
    if (meta.files_changed === 2 && meta.files.includes("image.png") && meta.files.includes("main.js")) {
      console.log("✓ Test 2 PASS: extractMetadata detects binary files");
      passed++;
    } else {
      console.log("✗ Test 2 FAIL: extractMetadata failed on binary files", meta);
      failed++;
    }
  } catch (err) {
    console.log("✗ Test 2 FAIL: extractMetadata threw error:", err.message);
    failed++;
  }

  // Test 3: filterBinaryFiles removes binary sections
  try {
    const filtered = filterBinaryFiles(binaryDiffSample);
    if (!filtered.includes("Binary files")) {
      console.log("✓ Test 3 PASS: filterBinaryFiles removes binary content");
      passed++;
    } else {
      console.log("✗ Test 3 FAIL: filterBinaryFiles still contains binary marker");
      failed++;
    }
  } catch (err) {
    console.log("✗ Test 3 FAIL: filterBinaryFiles threw error:", err.message);
    failed++;
  }

  // Test 4: filterBinaryFiles handles normal diff
  try {
    const filtered = filterBinaryFiles(normalDiffSample);
    if (filtered === normalDiffSample) {
      console.log("✓ Test 4 PASS: filterBinaryFiles preserves normal diff");
      passed++;
    } else {
      console.log("✗ Test 4 FAIL: filterBinaryFiles modified normal diff");
      failed++;
    }
  } catch (err) {
    console.log("✗ Test 4 FAIL: filterBinaryFiles threw error:", err.message);
    failed++;
  }

  // Test 5: extractMetadata rejects invalid input
  try {
    extractMetadata(null);
    console.log("✗ Test 5 FAIL: extractMetadata should throw on null input");
    failed++;
  } catch (err) {
    console.log("✓ Test 5 PASS: extractMetadata rejects invalid input");
    passed++;
  }

  // Test 6: filterBinaryFiles rejects invalid input
  try {
    filterBinaryFiles(null);
    console.log("✗ Test 6 FAIL: filterBinaryFiles should throw on null input");
    failed++;
  } catch (err) {
    console.log("✓ Test 6 PASS: filterBinaryFiles rejects invalid input");
    passed++;
  }

  console.log(`\nTests completed: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
