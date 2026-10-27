# Marcus Shih — Photography

A standalone, static Astro photography exhibition. This directory is the Git
repository **and** the Astro project root. There is no nested project or repository.

## Local development

Use Node 22.12+ (Node 22 LTS is specified in `.nvmrc`). From this directory:

```sh
npm ci
npm run dev
```

Open the local URL printed by Astro (normally http://127.0.0.1:4321).

```sh
npm run check
npm run build
npm run preview
```

`preview` serves the production build. No original portfolio checkout, account,
API key, environment variable, or server adapter is required.

## Content and layout

- `/`: immersive opening photograph, all 23 curated selections, four collections.
- `/collections/new-york/`, `/collections/tokyo/`, `/collections/busan/`,
  `/collections/taiwan/`: all 127 published photographs in their original order.
- `/about/`: biography retained from the original portfolio.
- `src/data/photography.ts`: original typed metadata, copied verbatim.
- `src/data/gallery.ts`: selection, cover, date, and responsive image helpers.
- `src/components/`: shared gallery, photograph, navigation, footer, and viewer.
- `src/styles/global.css`: typography, editorial layouts, and responsive behavior.
- `src/scripts/`: native dialog viewer and lightweight scroll reveals.

Portrait and landscape photographs keep their full compositions in galleries and
the viewer. Hero and collection previews use editorial crops on desktop; mobile
heroes show the complete image. Selecting a gallery image opens a viewer scoped
to that collection. Use arrows, left/right keyboard keys, or a horizontal touch
swipe to navigate; Escape or Close returns focus to the originating link. Without
JavaScript, photographs remain direct image links and the site content is visible.
Reduced-motion preferences disable transitions, reveals, and smooth scrolling.

## Updating photographs

1. Add a high-quality WebP under `public/img/photography/<folder>/web/`.
2. Add its metadata to `src/data/photography.ts`, including title, meaningful alt
   text, width, and height. Optional fields include caption, location, date,
   camera, lens, and exposure settings. Existing album slugs and folder names
   need not match (New York uses the `nyc` image folder).
3. Use `selectedOrder` to feature it on the homepage. Album order stays separate.
   `bannerSrc` overrides an album's hero without changing its photo order.
4. Run `npm run images` to generate the smaller 480/960/1600px variants and update
   `src/data/image-sizes.json`, then `npm run verify:assets` and `npm run build`.

Generated variants are committed alongside the untouched WebP files, so a fresh
clone can build without regenerating images. No remote fonts or animation
libraries are loaded.

## Migration and preservation

282 image files were copied and checksum-verified. This includes the 127 images
listed in the published metadata and additional existing photographs/versions.
All 141 WebP files are in `public/`; 141 JPEG/PNG originals are in the local,
Git-ignored `archive/photography/` directory. See [archive/README.md](archive/README.md)
for the original-file backup policy. No source photographs were deleted or edited.

The checksum inventory is `docs/migration-manifest.json`. Verify the local copy:

```sh
npm run verify:assets -- --archive
# With the dev or preview server running:
npm run verify:assets -- --http=http://127.0.0.1:4321
```

## Vercel (when approved)

This is a static Astro site, so no Vercel adapter is required. Configuration is in
`vercel.json`: framework Astro, build command `npm run build`, output `dist`.
Select Node 22.x and use this repository root as the Vercel project root.
See [Astro's Vercel deployment guide](https://docs.astro.build/en/guides/deploy/vercel/).
Set the final canonical domain and social share image metadata when the domain
is chosen. Nothing has been pushed or deployed as part of local development.
