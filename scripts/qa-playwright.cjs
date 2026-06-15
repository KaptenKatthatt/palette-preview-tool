const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..", "dist");
const output = path.resolve(__dirname, "..", "output", "playwright");
const host = "127.0.0.1";
const port = Number(process.env.QA_PORT ?? 4174);

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

const listen = () =>
  new Promise((resolve) => {
    server.listen(port, host, resolve);
  });

const close = () =>
  new Promise((resolve) => {
    server.close(resolve);
  });

async function run() {
  await listen();
  fs.mkdirSync(output, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 920 },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const desktopPage = await desktopContext.newPage();
  const consoleErrors = [];

  desktopPage.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  desktopPage.on("pageerror", (error) => consoleErrors.push(error.message));

  await desktopPage.goto(`http://${host}:${port}`, { waitUntil: "networkidle" });

  const initial = await desktopPage.evaluate(() => ({
    title: document.title,
    h1: document.querySelector("h1")?.textContent,
    paletteCount: document.querySelectorAll(".palette-column").length,
    roleRows: document.querySelectorAll(".role-row").length,
    contrastRows: document.querySelectorAll(".contrast-row").length,
    canScrollX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    canScrollY: document.documentElement.scrollHeight > document.documentElement.clientHeight,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
    },
  }));

  const modes = {};
  for (const label of ["Projects", "Editorial", "Dark", "Hero"]) {
    await desktopPage.getByRole("button", { name: label }).click();
    await desktopPage.waitForTimeout(100);
    modes[label] = (await desktopPage.locator(".preview").first().innerText()).slice(0, 160);
  }

  const importedPalette = {
    name: "Nordic Orbit",
    description: "Cooler AI test palette",
    colors: {
      paper: "#F5F3EE",
      paperSoft: "#FFFCF6",
      paperWarm: "#E2DED3",
      ink: "#092033",
      inkSoft: "#293B4C",
      inkMuted: "#66717A",
      line: "rgba(9, 32, 51, 0.14)",
      lineStrong: "rgba(9, 32, 51, 0.24)",
      solar: "#B7662B",
      solarBright: "#E99D3E",
      copper: "#85512B",
      deepSpace: "#07131F",
      spaceBlue: "#13283C",
    },
  };

  await desktopPage.getByLabel("Paste AI palette JSON").fill(
    JSON.stringify(importedPalette, null, 2),
  );
  await desktopPage.getByRole("button", { name: "Add palette" }).click();
  await desktopPage.waitForTimeout(150);

  const afterImport = await desktopPage.evaluate(() => ({
    paletteCount: document.querySelectorAll(".palette-column").length,
    notice: document.querySelector(".notice")?.textContent,
    selectedTitle: document.querySelector(".palette-column.is-selected h2")?.textContent,
  }));

  const exportText = await desktopPage.locator(".export-band pre").innerText();
  await desktopPage.screenshot({
    path: path.join(output, "desktop.jpg"),
    type: "jpeg",
    quality: 85,
    scale: "css",
  });

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(`http://${host}:${port}`, { waitUntil: "networkidle" });
  const mobile = await mobilePage.evaluate(() => ({
    h1: document.querySelector("h1")?.textContent,
    paletteCount: document.querySelectorAll(".palette-column").length,
    canScrollX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    canScrollY: document.documentElement.scrollHeight > document.documentElement.clientHeight,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
    },
  }));

  await mobilePage.screenshot({
    path: path.join(output, "mobile.jpg"),
    type: "jpeg",
    quality: 85,
    scale: "css",
  });

  await mobileContext.close();
  await desktopContext.close();
  await browser.close();

  return {
    initial,
    modes,
    afterImport,
    exportHasNordicVars:
      exportText.includes('data-palette="nordic-orbit"') &&
      exportText.includes("--color-paper"),
    mobile,
    consoleErrors,
  };
}

run()
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await close();
  });
