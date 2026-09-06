export const LOGO_GROUPLTD = {
  id: "groupLtd" as const,
  label: "Group Ltd",
  href: "/",
  src: "/brand/logos/looters-group-ltd.webp",
};

export const LOGO_APPAREL = {
  id: "apparel" as const,
  label: "Apparel",
  href: "/apparel",
  src: "/brand/logos/looters-apparel.webp",
};

export const LOGO_COMPUTAS = {
  id: "computas" as const,
  label: "Computas",
  href: "/computas",
  src: "/brand/logos/looters-computas.webp",
};

export const LOGO_SOFTWARE = {
  id: "software" as const,
  label: "Software",
  href: "/software",
  src: "/brand/logos/looters-software.webp",
};

export const STORE_LOGOS = [LOGO_GROUPLTD, LOGO_APPAREL, LOGO_COMPUTAS, LOGO_SOFTWARE] as const;
export type StoreLogo = (typeof STORE_LOGOS)[number];
export const GROUP_LOGO_SRC = LOGO_GROUPLTD.src;
