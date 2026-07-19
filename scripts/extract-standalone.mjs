import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const [source, outputRoot] = process.argv.slice(2);

if (!source || !outputRoot) {
  throw new Error("Usage: node extract-standalone.mjs <source.html> <output-directory>");
}

const html = await readFile(source, "utf8");
const imageDirectory = path.join(outputRoot, "images");
await mkdir(imageDirectory, { recursive: true });

const extensionFor = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

const extracted = new Map();
let imageIndex = 0;
let rewritten = html.replace(
  /data:(image\/(?:jpeg|png|webp|svg\+xml));base64,([A-Za-z0-9+/=]+)/g,
  (match, mime, base64) => {
    const digest = createHash("sha1").update(base64).digest("hex").slice(0, 10);
    if (!extracted.has(digest)) {
      imageIndex += 1;
      const filename = `source-${String(imageIndex).padStart(2, "0")}-${digest}.${extensionFor[mime]}`;
      extracted.set(digest, { filename, mime, base64 });
    }
    return `images/${extracted.get(digest).filename}`;
  },
);

for (const { filename, mime, base64 } of extracted.values()) {
  const target = path.join(imageDirectory, filename);
  if (mime === "image/svg+xml") {
    await writeFile(target, Buffer.from(base64, "base64").toString("utf8"), "utf8");
  } else {
    await writeFile(target, Buffer.from(base64, "base64"));
  }
}

const styleMatch = rewritten.match(/<style>([\s\S]*?)<\/style>/i);
if (styleMatch) {
  await writeFile(path.join(outputRoot, "current.css"), styleMatch[1].trim(), "utf8");
  rewritten = rewritten.replace(styleMatch[0], '<link rel="stylesheet" href="current.css">');
}

const scriptMatch = rewritten.match(/<script>([\s\S]*?)<\/script>/i);
if (scriptMatch) {
  await writeFile(path.join(outputRoot, "current.js"), scriptMatch[1].trim(), "utf8");
  rewritten = rewritten.replace(scriptMatch[0], '<script src="current.js"></script>');
}

await writeFile(path.join(outputRoot, "current.html"), rewritten, "utf8");
console.log(`Extracted ${extracted.size} unique images to ${imageDirectory}`);
