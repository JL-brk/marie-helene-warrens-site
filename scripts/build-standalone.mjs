import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const output = path.resolve(root, "..", "marie-helene-warrens-preview.html");

const mime = (file) => ({
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".woff2": "font/woff2",
}[path.extname(file).toLowerCase()] || "application/octet-stream");

const dataUrl = async (relative) => {
  const content = await readFile(path.join(root, relative));
  return `data:${mime(relative)};base64,${content.toString("base64")}`;
};

let html = await readFile(path.join(root, "index.html"), "utf8");
let css = await readFile(path.join(root, "assets", "styles.min.css"), "utf8");
const js = await readFile(path.join(root, "assets", "main.min.js"), "utf8");

css = css.replace("fonts/manrope-latin.woff2", await dataUrl("assets/fonts/manrope-latin.woff2"));
css = css.replace("fonts/newsreader-latin.woff2", await dataUrl("assets/fonts/newsreader-latin.woff2"));

html = html.replace(/\s+srcset="[^"]*"/g, "").replace(/\s+sizes="[^"]*"/g, "");
html = html.replace(/<link rel="preload"[^>]+>/g, "");
html = html.replace(/<link rel="stylesheet" href="assets\/styles\.min\.css\?v=\d+">/, `<style>${css}</style>`);
html = html.replace(/<script src="assets\/main\.min\.js\?v=\d+"><\/script>/, `<script>${js}</script>`);

const refs = [...new Set(html.match(/assets\/images\/[A-Za-z0-9._-]+/g) || [])];
for (const ref of refs) html = html.replaceAll(ref, await dataUrl(ref));

await writeFile(output, html, "utf8");
console.log(output);
