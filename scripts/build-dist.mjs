import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");
const pages = ["index.html", "rondleidingen.html", "over.html", "faq.html", "contact.html"];

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const page of pages) fs.copyFileSync(path.join(root, page), path.join(output, page));
for (const directory of ["assets", "fr", "en"]) {
  fs.cpSync(path.join(root, directory), path.join(output, directory), { recursive: true });
}

console.log("Built production-ready static output in dist/.");
