/** True when this page is inside Sifta (desktop app, PWA, or Sifta chrome). */
export function inSifta(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if ((window as Window & { siftaDesktop?: { isElectron?: boolean } }).siftaDesktop?.isElectron) {
      return true;
    }
    if (document.documentElement.dataset.sifta === "1") return true;
    if (/Sifta(Browser)?\//i.test(navigator.userAgent)) return true;
    if (window.matchMedia("(display-mode: standalone)").matches) return true;
  } catch {
    /* iframe */
  }
  return false;
}
