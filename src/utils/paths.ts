/** Resolve a site-relative route or public asset under Astro's configured base. */
export const withBase = (path: string) =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
