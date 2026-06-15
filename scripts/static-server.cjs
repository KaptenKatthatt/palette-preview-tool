const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT ?? 4173);
const host = "127.0.0.1";
const root = path.resolve(__dirname, "..", "dist");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url ?? "/", `http://${host}:${port}`);
  let filePath = path.join(root, decodeURIComponent(requestUrl.pathname));

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  if (!fs.existsSync(filePath)) {
    filePath = path.join(root, "index.html");
  }

  response.setHeader(
    "Content-Type",
    mimeTypes[path.extname(filePath)] ?? "application/octet-stream",
  );

  fs.createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Palette Preview Lab served at http://${host}:${port}`);
});
