/** OS choices for the Software section system carousel. */

export type OsId = "macos" | "win11" | "win10" | "android" | "apple" | "linux";

export type OsSystem = {
  id: OsId;
  label: string;
  short: string;
  /** Inline SVG data URL so we never depend on external logo CDNs. */
  logo: string;
  accent: string;
};

function svgData(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const macosLogo = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="14" fill="#111"/>
  <path fill="#fff" d="M44.3 33.6c-.1-5.2 4.3-7.7 4.5-7.9-2.5-3.6-6.3-4.1-7.6-4.2-3.2-.3-6.3 1.9-7.9 1.9-1.7 0-4.2-1.9-6.9-1.8-3.5.1-6.8 2.1-8.6 5.2-3.7 6.4-1 15.9 2.6 21.1 1.8 2.5 3.9 5.4 6.7 5.3 2.7-.1 3.7-1.7 7-1.7s4.2 1.7 7 1.6c2.9-.1 4.7-2.6 6.5-5.1 2-3 2.9-5.9 2.9-6 0-.1-5.5-2.1-5.6-8.4zM39.2 16.9c1.5-1.8 2.4-4.3 2.2-6.8-2.1.1-4.6 1.4-6.1 3.2-1.3 1.6-2.5 4.2-2.2 6.6 2.3.2 4.7-1.2 6.1-3z"/>
</svg>`);

const win11Logo = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="14" fill="#0078D4"/>
  <path fill="#fff" d="M14 14h16.5v16.5H14V14zm19.5 0H50v16.5H33.5V14zM14 33.5h16.5V50H14V33.5zm19.5 0H50V50H33.5V33.5z"/>
</svg>`);

const win10Logo = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="14" fill="#00A4EF"/>
  <path fill="#fff" d="M13 16.5l17.2-2.4v16.3H13V16.5zm18.8-2.7L51 11v19.4H31.8V13.8zM13 32.6h17.2V48.9L13 46.6V32.6zm18.8 0H51V51l-19.2-2.7V32.6z"/>
</svg>`);

const androidLogo = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="14" fill="#3DDC84"/>
  <path fill="#111" d="M22 28c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H24c-1.1 0-2-.9-2-2V28z"/>
  <path fill="#111" d="M26 18l-2.5-4.2a1 1 0 011.7-1L27.5 17h9l2.3-4.2a1 1 0 011.7 1L38 18H26z"/>
  <circle cx="28" cy="24" r="1.6" fill="#111"/>
  <circle cx="36" cy="24" r="1.6" fill="#111"/>
  <rect x="18" y="30" width="3" height="10" rx="1.5" fill="#111"/>
  <rect x="43" y="30" width="3" height="10" rx="1.5" fill="#111"/>
  <rect x="27" y="44" width="3" height="7" rx="1.5" fill="#111"/>
  <rect x="34" y="44" width="3" height="7" rx="1.5" fill="#111"/>
</svg>`);

const appleLogo = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="14" fill="#A2AAAD"/>
  <path fill="#111" d="M44.3 33.6c-.1-5.2 4.3-7.7 4.5-7.9-2.5-3.6-6.3-4.1-7.6-4.2-3.2-.3-6.3 1.9-7.9 1.9-1.7 0-4.2-1.9-6.9-1.8-3.5.1-6.8 2.1-8.6 5.2-3.7 6.4-1 15.9 2.6 21.1 1.8 2.5 3.9 5.4 6.7 5.3 2.7-.1 3.7-1.7 7-1.7s4.2 1.7 7 1.6c2.9-.1 4.7-2.6 6.5-5.1 2-3 2.9-5.9 2.9-6 0-.1-5.5-2.1-5.6-8.4zM39.2 16.9c1.5-1.8 2.4-4.3 2.2-6.8-2.1.1-4.6 1.4-6.1 3.2-1.3 1.6-2.5 4.2-2.2 6.6 2.3.2 4.7-1.2 6.1-3z"/>
  <text x="32" y="58" text-anchor="middle" font-size="8" font-family="system-ui,sans-serif" fill="#111" font-weight="700">iOS</text>
</svg>`);

const linuxLogo = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="14" fill="#FCC624"/>
  <ellipse cx="32" cy="28" rx="12" ry="14" fill="#111"/>
  <ellipse cx="32" cy="30" rx="9" ry="10" fill="#333"/>
  <circle cx="27" cy="26" r="2.2" fill="#FCC624"/>
  <circle cx="37" cy="26" r="2.2" fill="#FCC624"/>
  <path fill="#111" d="M22 44c2 4 6 7 10 7s8-3 10-7c-3 2-6.5 3-10 3s-7-1-10-3z"/>
  <path fill="#111" d="M24 18c-3-2-4-6-2-7 3 2 5 4 5 6 0 1-1 2-3 1zm16 0c3-2 4-6 2-7-3 2-5 4-5 6 0 1 1 2 3 1z"/>
</svg>`);

export const OS_SYSTEMS: OsSystem[] = [
  { id: "macos", label: "macOS", short: "Mac", logo: macosLogo, accent: "#111111" },
  { id: "win11", label: "Windows 11", short: "Win11", logo: win11Logo, accent: "#0078D4" },
  { id: "win10", label: "Windows 10", short: "Win10", logo: win10Logo, accent: "#00A4EF" },
  { id: "android", label: "Android", short: "Android", logo: androidLogo, accent: "#3DDC84" },
  { id: "apple", label: "Apple (iOS)", short: "iOS", logo: appleLogo, accent: "#A2AAAD" },
  { id: "linux", label: "Linux", short: "Linux", logo: linuxLogo, accent: "#FCC624" },
];

export function getOsById(id: OsId): OsSystem {
  return OS_SYSTEMS.find((s) => s.id === id) ?? OS_SYSTEMS[0]!;
}
