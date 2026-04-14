const http = require("http");

function runLLM(prompt) {
  const HOST = process.env.HOST;
  const MODEL = process.env.MODEL;
  const TIMEOUT_MS = parseInt(process.env.TIMEOUT_MS, 10);

  // Validate required environment variables
  if (!HOST || !MODEL || !TIMEOUT_MS) {
    throw new Error("Missing required environment variables: HOST, MODEL, and TIMEOUT_MS must be set");
  }

  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: MODEL,
      prompt: prompt,
      stream: false
    });

    const url = new URL("/api/generate", HOST);

    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: "POST",
        timeout: TIMEOUT_MS,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data)
        }
      },
      (res) => {
        let body = "";

        res.on("data", (chunk) => {
          body += chunk.toString();
        });

        res.on("end", () => {
          try {
            const parsed = JSON.parse(body);
            resolve(parsed.response || "");
          } catch (err) {
            reject(new Error("LLM_INVALID_RESPONSE"));
          }
        });
      }
    );

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("LLM_TIMEOUT"));
    });

    req.on("error", () => {
      reject(new Error("LLM_NOT_RUNNING"));
    });

    req.write(data);
    req.end();
  });
}

module.exports = { runLLM };