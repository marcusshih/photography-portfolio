import { readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import sharp from "sharp";

const manifest = JSON.parse(
  await readFile("docs/migration-manifest.json", "utf8"),
);
const images = JSON.parse(await readFile("src/data/image-sizes.json", "utf8"));
const metadata = await readFile("src/data/photography.ts", "utf8");
const references = [
  ...metadata.matchAll(/\b(?:src|bannerSrc):\s*"([^"]+)"/g),
].map((match) => match[1]);
for (const src of references)
  assert(images[src], `Missing image manifest entry: ${src}`);

const urls = new Set();
for (const [src, image] of Object.entries(images)) {
  const actual = await sharp(`public${src}`).metadata();
  assert.equal(actual.width, image.width, `Width mismatch: ${src}`);
  assert.equal(actual.height, image.height, `Height mismatch: ${src}`);
  await sharp(`public${src}`).resize(1, 1).toBuffer(); // Decode the source, rather than only checking filenames.
  for (const variant of image.variants) {
    assert(
      (await stat(`public${variant.src}`)).size > 0,
      `Empty image: ${variant.src}`,
    );
    const variantInfo = await sharp(`public${variant.src}`).metadata();
    assert.equal(
      variantInfo.width,
      variant.width,
      `Invalid srcset width: ${variant.src}`,
    );
    urls.add(variant.src);
  }
}

const preserved = manifest.files.filter(
  (file) =>
    !file.destination.startsWith("archive/") ||
    process.argv.includes("--archive"),
);
for (const file of preserved) {
  const data = await readFile(file.destination);
  assert.equal(data.length, file.bytes, `Size mismatch: ${file.destination}`);
  assert.equal(
    createHash("sha256").update(data).digest("hex"),
    file.sha256,
    `Checksum mismatch: ${file.destination}`,
  );
}

const httpArgument = process.argv.find((arg) => arg.startsWith("--http="));
if (httpArgument) {
  const base = httpArgument.slice("--http=".length);
  const paths = [
    ...urls,
    "/",
    "/about/",
    "/collections/new-york/",
    "/collections/tokyo/",
    "/collections/busan/",
    "/collections/taiwan/",
  ];
  for (let index = 0; index < paths.length; index += 12) {
    await Promise.all(
      paths.slice(index, index + 12).map(async (path) => {
        const response = await fetch(new URL(path, base));
        assert.equal(response.status, 200, `HTTP failure: ${path}`);
        if (path.endsWith(".webp"))
          assert(
            response.headers.get("content-type")?.startsWith("image/"),
            `Wrong content type: ${path}`,
          );
        await response.arrayBuffer();
      }),
    );
  }
  console.log(`HTTP verified ${paths.length} image and page URLs.`);
}
console.log(
  `Verified ${references.length} metadata references, ${Object.keys(images).length} WebP images, ${urls.size} responsive image URLs, and ${preserved.length} preserved file checksums.`,
);
