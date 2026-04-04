import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** GitHub Pages のプロジェクトサイトは /リポジトリ名/ がベース URL になる */
const pagesBase = "/sort-viz/";

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS === "true" ? pagesBase : "/",
});
