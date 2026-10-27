export {};
type Photo = {
  src: string;
  title: string;
  alt: string;
  album: string;
  albumHref: string;
  caption?: string;
  location?: string;
  date?: string;
  camera?: string;
  lens?: string;
  settings?: string;
};
const catalog = JSON.parse(
  document.querySelector("#photo-data")?.textContent ?? "[]",
) as Photo[];
const dialog = document.querySelector<HTMLDialogElement>(".viewer")!;
const image = dialog.querySelector<HTMLImageElement>(".viewer-image")!;
const title = dialog.querySelector<HTMLElement>("#viewer-title")!;
const album = dialog.querySelector<HTMLAnchorElement>(".viewer-album")!;
const count = dialog.querySelector<HTMLElement>(".viewer-count")!;
const loadStatus = dialog.querySelector<HTMLElement>(".viewer-status")!;
const details = dialog.querySelector<HTMLDetailsElement>(".viewer-details")!;
const list = details.querySelector("dl")!;
let sequence: Photo[] = [];
let current = 0;
let trigger: HTMLAnchorElement | null = null;
let request = 0;

function show(index: number) {
  current = (index + sequence.length) % sequence.length;
  const photo = sequence[current];
  const token = ++request;
  title.textContent = photo.title;
  album.textContent = photo.album;
  album.href = photo.albumHref;
  count.textContent = `${String(current + 1).padStart(2, "0")} / ${String(sequence.length).padStart(2, "0")}`;
  list.replaceChildren();
  const fields = [
    ["Caption", photo.caption],
    ["Location", photo.location],
    ["Date", photo.date],
    ["Camera", photo.camera],
    ["Lens", photo.lens],
    ["Exposure", photo.settings],
  ];
  for (const [label, value] of fields) {
    if (!value) continue;
    const wrapper = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label!;
    description.textContent = value;
    wrapper.append(term, description);
    list.append(wrapper);
  }
  details.hidden = list.childElementCount === 0;
  image.classList.remove("ready");
  loadStatus.textContent = "Loading photograph…";
  const loader = new Image();
  loader.onload = () => {
    if (token !== request || !dialog.open) return;
    image.alt = photo.alt;
    image.src = photo.src;
    image.classList.add("ready");
    loadStatus.textContent = "";
    // Warm only the next frame, rather than downloading the entire collection.
    if (sequence.length > 1) {
      const next = new Image();
      next.src = sequence[(current + 1) % sequence.length].src;
    }
  };
  loader.onerror = () => {
    if (token === request)
      loadStatus.textContent =
        "This photograph could not load. Try the next photograph or close and reopen the viewer.";
  };
  loader.src = photo.src;
}

document
  .querySelectorAll<HTMLAnchorElement>("a[data-photo]")
  .forEach((link) => {
    link.addEventListener("click", (event) => {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      )
        return;
      if (typeof dialog.showModal !== "function") return;
      const scope =
        link.closest("[data-gallery]") ??
        document.querySelector("[data-gallery]");
      const ids = [
        ...(scope?.querySelectorAll<HTMLAnchorElement>("a[data-photo]") ?? []),
      ].map((item) => item.dataset.photo);
      if (!ids.includes(link.dataset.photo)) ids.unshift(link.dataset.photo);
      sequence = [...new Set(ids)].flatMap((src) => {
        const photo = catalog.find((item) => item.src === src);
        return photo ? [photo] : [];
      });
      const index = sequence.findIndex(
        (photo) => photo.src === link.dataset.photo,
      );
      if (index < 0) return;
      event.preventDefault();
      trigger = link;
      details.open = false;
      dialog.showModal();
      document.body.classList.add("viewer-open");
      show(index);
    });
  });

dialog
  .querySelector(".viewer-close")
  ?.addEventListener("click", () => dialog.close());
dialog
  .querySelectorAll<HTMLButtonElement>("[data-step]")
  .forEach((button) =>
    button.addEventListener("click", () =>
      show(current + Number(button.dataset.step)),
    ),
  );
dialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    event.preventDefault();
    show(current + (event.key === "ArrowRight" ? 1 : -1));
  }
});
dialog.addEventListener("close", () => {
  ++request;
  document.body.classList.remove("viewer-open");
  trigger?.focus({ preventScroll: true });
});
let start: { x: number; y: number } | null = null;
const stage = dialog.querySelector<HTMLElement>(".viewer-stage")!;
stage.addEventListener("pointerdown", (event) => {
  if (event.pointerType !== "mouse")
    start = { x: event.clientX, y: event.clientY };
});
stage.addEventListener("pointercancel", () => {
  start = null;
});
stage.addEventListener("pointerup", (event) => {
  if (!start) return;
  const dx = event.clientX - start.x;
  const dy = event.clientY - start.y;
  start = null;
  if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5)
    show(current + (dx < 0 ? 1 : -1));
});
