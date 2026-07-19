import { readFile, writeFile } from "node:fs/promises";

const files = ["index.html", "rondleidingen.html", "over.html", "faq.html", "contact.html"];

for (const file of files) {
  let html = await readFile(file, "utf8");
  html = html.replace("<!doctype html>", "<!DOCTYPE html>");
  html = html.replaceAll(
    /<span><strong>Gediplomeerde stadsgids<\/strong><p>(.*?)<\/p><\/span>/g,
    '<div><strong>Gediplomeerde stadsgids</strong><p>$1</p></div>',
  );
  html = html.replaceAll('<h4>Ga naar</h4><nav>', '<h4>Ga naar</h4><nav aria-label="Voetnavigatie">');
  html = html.replace('id="naam" name="naam" autocomplete="name"', 'id="naam" name="naam" type="text" autocomplete="name"');
  await writeFile(file, html, "utf8");
}
