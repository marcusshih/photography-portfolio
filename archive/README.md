# Photography originals

`photography/` contains byte-for-byte local copies of every JPEG and PNG from the
original portfolio's photography directory (141 files). All 141 existing WebP
files are retained separately in `public/img/photography/`.

The originals are deliberately outside `public/` and ignored by Git: they are
about 1.8 GiB and are not needed to build or run the website. This folder is a
local preservation archive, not a remote backup. Back it up separately or arrange
Git LFS/object storage before expecting originals to accompany a future clone.
The original portfolio remains another complete copy.

`docs/migration-manifest.json` records the original relative path, new location,
file size, and SHA-256 checksum of all 282 migrated images. To check the complete
local archive as well as the web images, run:

```sh
npm run verify:assets -- --archive
```

Nothing in `src/` reads from this archive or the original repository. The retained
`originalSrc` metadata describes the old source location; the new UI uses `src`
and its responsive derivatives. No original paths are requested by the browser.
