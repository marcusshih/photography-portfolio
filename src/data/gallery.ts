import { withBase } from "../utils/paths";
import { albums, type Photograph, type PhotoAlbum } from "./photography";
import sizes from "./image-sizes.json";

export { albums };
export type { Photograph, PhotoAlbum };
export type Entry = { photo: Photograph; album: PhotoAlbum };
export const coverFor = (album: PhotoAlbum) =>
  album.photographs.find((photo) => photo.src === album.bannerSrc) ??
  album.photographs[0];

/** Keep cover images out of galleries and lead with the first landscape. */
export function galleryEntries(album: PhotoAlbum): Entry[] {
  return landscapeFirst(
    album.photographs
      .filter(
        (photo) =>
          photo.src !== coverFor(album).src &&
          !/banner\.webp$/i.test(photo.src),
      )
      .map((photo) => ({ photo, album })),
  );
}
function landscapeFirst(entries: Entry[]): Entry[] {
  const index = entries.findIndex(({ photo }) => photo.width > photo.height);
  if (index <= 0) return entries;
  return [
    entries[index],
    ...entries.slice(0, index),
    ...entries.slice(index + 1),
  ];
}
export const allPhotos: Entry[] = albums.flatMap(galleryEntries);
export const selectedPhotos = landscapeFirst(
  allPhotos
    .filter(({ photo }) => photo.selectedOrder !== undefined)
    .sort((a, b) => a.photo.selectedOrder! - b.photo.selectedOrder!),
);
export function imageFor(photo: Photograph) {
  const image = (
    sizes as Record<
      string,
      {
        width: number;
        height: number;
        variants: { src: string; width: number }[];
      }
    >
  )[photo.src];
  return {
    width: image?.width ?? photo.width,
    height: image?.height ?? photo.height,
    srcset: image?.variants
      .map((v) => `${withBase(v.src)} ${v.width}w`)
      .join(", "),
  };
}
export function yearsFor(album: PhotoAlbum) {
  const years = [
    ...new Set(
      album.photographs.flatMap((photo) => photo.date?.match(/\d{4}/g) ?? []),
    ),
  ].sort();
  return years.length > 1 ? `${years[0]}—${years.at(-1)}` : (years[0] ?? "");
}
