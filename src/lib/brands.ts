/** Brand marks in /public/artwork/brands — vectors where possible. */
export const BRANDS = [
  { file: "intel.png", name: "Intel" },
  { file: "amd.png", name: "AMD" },
  { file: "nvidia.png", name: "NVIDIA" },
  { file: "radeon.png", name: "Radeon" },
  { file: "asus.png", name: "ASUS" },
  { file: "rog.png", name: "ASUS ROG" },
  { file: "msi.png", name: "MSI" },
  { file: "gigabyte.png", name: "GIGABYTE" },
  { file: "corsair.png", name: "Corsair" },
  { file: "razer.png", name: "Razer" },
  { file: "logitech-g.png", name: "Logitech G" },
  { file: "steelseries.png", name: "SteelSeries" },
  { file: "hyperx.png", name: "HyperX" },
  { file: "attack-shark.png", name: "Attack Shark" },
  { file: "nzxt.png", name: "NZXT" },
  { file: "cooler-master.png", name: "Cooler Master" },
  { file: "thermaltake.png", name: "Thermaltake" },
  { file: "gskill.png", name: "G.SKILL" },
  { file: "kingston.png", name: "Kingston" },
  { file: "samsung.png", name: "Samsung" },
  { file: "seagate.png", name: "Seagate" },
  { file: "western-digital.png", name: "Western Digital" },
  { file: "elgato.png", name: "Elgato" },
  { file: "alienware.png", name: "Alienware" },
  { file: "steam.png", name: "Steam" },
  { file: "microsoft.png", name: "Microsoft" },
  { file: "vive.png", name: "VIVE" },
  { file: "raspberry-pi.png", name: "Raspberry Pi" },
  { file: "framework.png", name: "Framework" },
  { file: "linux.png", name: "Linux" },
] as const;

export function brandSrc(file: string) {
  return `/artwork/brands/${file}`;
}
