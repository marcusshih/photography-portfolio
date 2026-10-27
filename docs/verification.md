# Local verification

Verified October 27, 2026, using Node 22.17.1 and Astro 5.18.2.

- `pwd` and `git rev-parse --show-toplevel` both resolve to the new repository
  root. `package.json` is directly in that root; the only `.git` is its own.
- `npm run check`: zero errors, warnings, or hints.
- `npm run build`: seven static pages, including the custom 404 page.
- `npm run verify:assets -- --archive`: all 282 preserved file checksums match.
- All 141 web images decoded successfully; all 484 responsive image URLs have
  matching files and dimensions. All metadata image references resolve.
- HTTP audit: 490 successful image and page requests against the local server.
- Built HTML audit: local asset and page links resolve inside `dist/`. Album
  galleries contain 11 / 36 / 14 / 66 photographs, plus an independent hero link.
- Chrome desktop visual inspection: homepage, paired editorial gallery, viewer.
- Chrome 390 × 844 viewport: homepage, portrait gallery, viewer, Taiwan album;
  no horizontal overflow on the inspected pages.
- Chrome 320 × 568 viewport against the production build: About and New York;
  no horizontal overflow. Production viewer opens and navigates correctly.
- Viewer checks: next button, right arrow key, metadata disclosure, Escape,
  and focus restoration. No production browser console errors observed.
- The original repository's working tree remains clean. No commits, pushes,
  hosting registrations, or deployments were performed.

Touch swipe handling and reduced-motion styles are implemented. Physical mobile
hardware, assistive technology, and multiple browser engines were not tested.

`homepage-preview.jpg` is a screenshot of the production build. All application
dependencies and web assets reside in this repository; originals in the local
archive are not required at runtime or build time.

The compatible `unifont` 0.7.4 override avoids the Node 22.19 requirement introduced
by its newer transitive dependency while retaining Astro's supported version range.
