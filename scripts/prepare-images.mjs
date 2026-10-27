import sharp from "sharp";
import { readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// Web originals are retained untouched. Smaller responsive copies are additive.
const base = path.resolve("public/img/photography");
const manifest = {};
for (const album of await readdir(base, { withFileTypes: true })) {
  if (!album.isDirectory()) continue;
  const input = path.join(base, album.name, "web");
  const output = path.resolve("public/images", album.name);
  await mkdir(output, { recursive: true });
  for (const file of await readdir(input)) {
    if (!file.endsWith(".webp")) continue;
    const original = path.join(input, file);
    const { width, height } = await sharp(original).metadata();
    const src = `/img/photography/${album.name}/web/${file}`;
    const variants = [];
    for (const size of [480, 960, 1600]) {
      if (size >= width) continue;
      const name = `${path.parse(file).name}-${size}.webp`;
      await sharp(original)
        .resize({ width: size, withoutEnlargement: true })
        .webp({ quality: 86 })
        .toFile(path.join(output, name));
      variants.push({ src: `/images/${album.name}/${name}`, width: size });
    }
    variants.push({ src, width });
    manifest[src] = { width, height, variants };
  }
}
await writeFile(
  "src/data/image-sizes.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  `Prepared responsive images for ${Object.keys(manifest).length} photographs.`,
);
