import { readFile, writeFile } from "node:fs/promises";

for (const file of ["index.html", "rondleidingen.html", "over.html", "faq.html", "contact.html"]) {
  let html = await readFile(file, "utf8");
  html = html.replaceAll(/assets\/styles\.css(?:\?v=\d+)?/g, "assets/styles.css?v=4");
  html = html.replaceAll(/assets\/main\.js(?:\?v=\d+)?/g, "assets/main.js?v=4");
  await writeFile(file, html, "utf8");
}
