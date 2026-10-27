export {};
const header = document.querySelector<HTMLElement>(".site-header");
const updateHeader = () =>
  header?.classList.toggle("is-scrolled", window.scrollY > 50);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
if ("IntersectionObserver" in window && !motion.matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0, rootMargin: "0px 0px 40px 0px" },
  );
  document
    .querySelectorAll("[data-reveal]")
    .forEach((element) => observer.observe(element));
  document.documentElement.classList.add("can-reveal");
  motion.addEventListener("change", () => {
    if (motion.matches) {
      document.documentElement.classList.remove("can-reveal");
      observer.disconnect();
    }
  });
}
