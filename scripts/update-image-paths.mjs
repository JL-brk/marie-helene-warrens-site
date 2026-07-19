import { readFile, writeFile } from "node:fs/promises";

const files = ["index.html", "rondleidingen.html", "over.html"];
const replacements = new Map([
  ["assets/images/hero.jpg", "assets/images/hero-optimized.webp"],
  ["assets/images/street.jpg", "assets/images/street-optimized.webp"],
  ["assets/images/cathedral.jpg", "assets/images/cathedral-optimized.webp"],
  ["assets/images/sint-jacob.jpg", "assets/images/sint-jacob-optimized.webp"],
  ["assets/images/zurenborg.jpg", "assets/images/zurenborg-optimized.webp"],
  ["assets/images/zurenborg-house.jpg", "assets/images/zurenborg-house-optimized.webp"],
]);

for (const file of files) {
  let contents = await readFile(file, "utf8");
  for (const [before, after] of replacements) contents = contents.replaceAll(before, after);
  await writeFile(file, contents, "utf8");
}
