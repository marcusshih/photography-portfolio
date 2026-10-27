import { albums, type Photograph, type PhotoAlbum } from "./photography";
import sizes from "./image-sizes.json";

export { albums };
export type { Photograph, PhotoAlbum };
export type Entry = { photo: Photograph; album: PhotoAlbum };
export const allPhotos: Entry[] = albums.flatMap((album) =>
  album.photographs.map((photo) => ({ photo, album })),
);
export const selectedPhotos = allPhotos
  .filter(({ photo }) => photo.selectedOrder !== undefined)
  .sort((a, b) => a.photo.selectedOrder! - b.photo.selectedOrder!);
export const coverFor = (album: PhotoAlbum) =>
  album.photographs.find((photo) => photo.src === album.bannerSrc) ??
  album.photographs[0];
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
    srcset: image?.variants.map((v) => `${v.src} ${v.width}w`).join(", "),
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
