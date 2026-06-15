import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

function socialMetaPlugin(siteUrl: string | undefined): Plugin {
  return {
    name: "social-meta-absolute-urls",
    transformIndexHtml(html) {
      if (!siteUrl) {
        return html;
      }

      const assetUrl = (assetPath: string) => `${siteUrl}${assetPath}`;

      return html
        .replace(
          /<meta property="og:locale:alternate"/,
          `<meta property="og:url" content="${siteUrl}/" />\n    <meta property="og:image:type" content="image/png" />\n    <meta property="og:locale:alternate"`,
        )
        .replace(
          /content="\/og-image\.png"/g,
          `content="${assetUrl("/og-image.png")}"`,
        )
        .replace(
          /href="\/favicon\.svg"/g,
          `href="${assetUrl("/favicon.svg")}"`,
        )
        .replace(
          /href="\/og-image\.png"/g,
          `href="${assetUrl("/og-image.png")}"`,
        );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const siteUrl = (
    env.VITE_SITE_URL ??
    (mode === "production" ? "https://palette-preview-lab.vercel.app" : undefined)
  )?.replace(/\/$/, "");

  return {
    plugins: [react(), socialMetaPlugin(siteUrl)],
  };
});
