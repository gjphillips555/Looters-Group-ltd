import { markedUp } from "@/lib/charm";
import { nzd, type ShippingOption } from "@/lib/products";

export type Slot = "case" | "board" | "cpu" | "cooler" | "ram" | "gpu" | "psu" | "fans";
export type Fit = "itx" | "matx" | "atx";

export type Part = {
  id: string;
  slot: Slot;
  brand: string;
  name: string;
  cost: number;
  photo: string;
  form?: Fit;
  accepts?: Fit[];
  gpuMax?: number;
  gpuAtx?: number;
  coolerMax?: number;
  rads?: number[];
  psuForms?: Array<"atx" | "sfx">;
  psuMaxLen?: number;
  socket?: "AM4" | "AM5";
  memory?: "DDR4" | "DDR5";
  watts?: number;
  length?: number;
  height?: number;
  rad?: number;
  psuForm?: "atx" | "sfx";
  psuLen?: number;
  sticks?: number;
  rgb?: boolean;
  tone?: "black" | "white" | "pink";
};

export const BUILD_SHIP: ShippingOption[] = [
  { id: "north", label: "North Island courier", price: 18 },
  { id: "south", label: "South Island courier", price: 26 },
];

export const SLOTS: { id: Slot; label: string }[] = [
  { id: "case", label: "Case" },
  { id: "board", label: "Motherboard" },
  { id: "cpu", label: "CPU" },
  { id: "cooler", label: "CPU cooler" },
  { id: "ram", label: "Memory" },
  { id: "gpu", label: "Graphics card" },
  { id: "psu", label: "Power supply" },
  { id: "fans", label: "Case fans" },
];

const P = {
  ch160: "/artwork/builder/ch160.jpg",
  pop: "/artwork/builder/pop.jpg",
  ryzen: "/artwork/builder/ryzen.jpg",
  board: "/artwork/builder/board.jpg",
  ddr4: "/artwork/builder/ddr4.jpg",
  cooler: "/artwork/builder/cooler.jpg",
  fan: "/artwork/builder/fan.jpg",
  psu: "/artwork/floor/c7.jpg",
  gt710: "/artwork/sourced/gt710.jpg",
  rtx3050: "/artwork/sourced/rtx3050.jpg",
  b570: "/artwork/sourced/b570.jpg",
  rx9060: "/artwork/sourced/rx9060.jpg",
} as const;

export const PARTS: Part[] = [
  {
    id: "case-ch160",
    slot: "case",
    brand: "Deepcool",
    name: "CH160 TG White",
    cost: 78.99,
    photo: P.ch160,
    accepts: ["itx"],
    gpuMax: 305,
    gpuAtx: 230,
    coolerMax: 172,
    rads: [120],
    psuForms: ["atx", "sfx"],
    psuMaxLen: 140,
    tone: "white",
  },
  {
    id: "case-v170",
    slot: "case",
    brand: "Thermaltake",
    name: "View 170 ARGB Black",
    cost: 99,
    photo: P.pop,
    accepts: ["itx", "matx"],
    gpuMax: 330,
    coolerMax: 160,
    rads: [120, 240],
    psuForms: ["atx"],
    psuMaxLen: 180,
    rgb: true,
    tone: "black",
  },
  {
    id: "case-v170p",
    slot: "case",
    brand: "Thermaltake",
    name: "View 170 ARGB Pink",
    cost: 99,
    photo: P.pop,
    accepts: ["itx", "matx"],
    gpuMax: 330,
    coolerMax: 160,
    rads: [120, 240],
    psuForms: ["atx"],
    psuMaxLen: 180,
    rgb: true,
    tone: "pink",
  },
  {
    id: "case-pop",
    slot: "case",
    brand: "Fractal",
    name: "Pop 2 Air Black TG",
    cost: 179,
    photo: P.pop,
    accepts: ["itx", "matx", "atx"],
    gpuMax: 360,
    coolerMax: 170,
    rads: [120, 240, 360],
    psuForms: ["atx"],
    psuMaxLen: 200,
    tone: "black",
  },
  {
    id: "case-popw",
    slot: "case",
    brand: "Fractal",
    name: "Pop 2 Air RGB White TG",
    cost: 199,
    photo: P.pop,
    accepts: ["itx", "matx", "atx"],
    gpuMax: 360,
    coolerMax: 170,
    rads: [120, 240, 360],
    psuForms: ["atx"],
    psuMaxLen: 200,
    rgb: true,
    tone: "white",
  },
  {
    id: "board-b550m",
    slot: "board",
    brand: "MSI",
    name: "B550M PRO-VDH WIFI",
    cost: 218.99,
    photo: P.board,
    form: "matx",
    socket: "AM4",
    memory: "DDR4",
  },
  {
    id: "board-b550g",
    slot: "board",
    brand: "Gigabyte",
    name: "B550M DS3H AC",
    cost: 218.99,
    photo: P.board,
    form: "matx",
    socket: "AM4",
    memory: "DDR4",
  },
  {
    id: "board-a520i",
    slot: "board",
    brand: "Gigabyte",
    name: "A520I AC",
    cost: 239,
    photo: P.board,
    form: "itx",
    socket: "AM4",
    memory: "DDR4",
  },
  {
    id: "board-b650b",
    slot: "board",
    brand: "MSI",
    name: "B650M Bomber WIFI",
    cost: 218.99,
    photo: P.board,
    form: "matx",
    socket: "AM5",
    memory: "DDR5",
  },
  {
    id: "board-b650g",
    slot: "board",
    brand: "MSI",
    name: "B650M Gaming Plus WIFI",
    cost: 269,
    photo: P.board,
    form: "matx",
    socket: "AM5",
    memory: "DDR5",
  },
  {
    id: "board-b650t",
    slot: "board",
    brand: "MSI",
    name: "MAG B650 Tomahawk WIFI",
    cost: 429,
    photo: P.board,
    form: "atx",
    socket: "AM5",
    memory: "DDR5",
  },
  {
    id: "cpu-5600",
    slot: "cpu",
    brand: "AMD",
    name: "Ryzen 5 5600",
    cost: 269,
    photo: P.ryzen,
    socket: "AM4",
    watts: 65,
  },
  {
    id: "cpu-9600x",
    slot: "cpu",
    brand: "AMD",
    name: "Ryzen 5 9600X",
    cost: 459,
    photo: P.ryzen,
    socket: "AM5",
    watts: 65,
  },
  {
    id: "cool-pa",
    slot: "cooler",
    brand: "Thermalright",
    name: "Peerless Assassin 120 SE",
    cost: 149,
    photo: P.cooler,
    height: 155,
    rad: 0,
  },
  {
    id: "ram-d4",
    slot: "ram",
    brand: "Kingston",
    name: "Fury Beast 16GB DDR4-3600",
    cost: 109.51,
    photo: P.ddr4,
    memory: "DDR4",
    sticks: 2,
  },
  {
    id: "ram-d4rgb",
    slot: "ram",
    brand: "Kingston",
    name: "Fury Beast RGB 16GB DDR4-3200",
    cost: 117,
    photo: P.ddr4,
    memory: "DDR4",
    sticks: 2,
    rgb: true,
  },
  {
    id: "ram-d5",
    slot: "ram",
    brand: "Kingston",
    name: "Fury Beast 32GB DDR5-6000",
    cost: 516.35,
    photo: P.ddr4,
    memory: "DDR5",
    sticks: 1,
  },
  {
    id: "ram-d5rgb",
    slot: "ram",
    brand: "Kingston",
    name: "Fury Beast RGB 32GB DDR5-6000",
    cost: 1033.85,
    photo: P.ddr4,
    memory: "DDR5",
    sticks: 2,
    rgb: true,
  },
  {
    id: "gpu-710",
    slot: "gpu",
    brand: "Gigabyte",
    name: "GeForce GT 710 2GB",
    cost: 113.85,
    photo: P.gt710,
    length: 150,
    watts: 25,
  },
  {
    id: "gpu-3050",
    slot: "gpu",
    brand: "MSI",
    name: "RTX 3050 Ventus 6GB",
    cost: 504.85,
    photo: P.rtx3050,
    length: 235,
    watts: 130,
  },
  {
    id: "gpu-b570",
    slot: "gpu",
    brand: "ASRock",
    name: "Arc B570 Challenger 10GB",
    cost: 550.85,
    photo: P.b570,
    length: 270,
    watts: 190,
  },
  {
    id: "gpu-9060",
    slot: "gpu",
    brand: "XFX",
    name: "RX 9060 XT 16GB",
    cost: 884.35,
    photo: P.rx9060,
    length: 320,
    watts: 180,
  },
  {
    id: "psu-550",
    slot: "psu",
    brand: "Thermalright",
    name: "TB550S 550W Bronze",
    cost: 85,
    photo: P.psu,
    watts: 550,
    psuForm: "atx",
    psuLen: 140,
  },
  {
    id: "psu-650",
    slot: "psu",
    brand: "Thermalright",
    name: "TB650S 650W Bronze",
    cost: 99,
    photo: P.psu,
    watts: 650,
    psuForm: "atx",
    psuLen: 140,
  },
  {
    id: "psu-650g",
    slot: "psu",
    brand: "Thermalright",
    name: "KG650 650W Gold",
    cost: 119,
    photo: P.psu,
    watts: 650,
    psuForm: "atx",
    psuLen: 150,
  },
  {
    id: "psu-750",
    slot: "psu",
    brand: "Thermalright",
    name: "SG750 750W Gold",
    cost: 165,
    photo: P.psu,
    watts: 750,
    psuForm: "atx",
    psuLen: 160,
  },
  {
    id: "fan-p12",
    slot: "fans",
    brand: "Antec",
    name: "P12 PWM 3-pack",
    cost: 44.1,
    photo: P.fan,
  },
];

export const partById = Object.fromEntries(PARTS.map((part) => [part.id, part])) as Record<string, Part>;

export function partPrice(part: Part) {
  return markedUp(part.cost);
}

export function partLabel(part: Part) {
  return `${part.brand} ${part.name} · ${nzd(partPrice(part))}`;
}

export type PickMap = Record<Slot, string | null>;

export const emptyPick = (): PickMap => ({
  case: null,
  board: null,
  cpu: null,
  cooler: null,
  ram: null,
  gpu: null,
  psu: null,
  fans: null,
});

function chosen(pick: PickMap, slot: Slot) {
  const id = pick[slot];
  return id ? partById[id] : undefined;
}

export function blockReason(part: Part, pick: PickMap): string | null {
  const box = chosen(pick, "case");
  const board = part.slot === "board" ? part : chosen(pick, "board");
  const cpu = part.slot === "cpu" ? part : chosen(pick, "cpu");
  const gpu = part.slot === "gpu" ? part : chosen(pick, "gpu");
  const psu = part.slot === "psu" ? part : chosen(pick, "psu");
  const cooler = part.slot === "cooler" ? part : chosen(pick, "cooler");

  if (part.slot === "board" && box && part.form && !box.accepts?.includes(part.form)) {
    return "Doesn't fit this case";
  }
  if (part.slot === "cpu" && board && part.socket && board.socket && part.socket !== board.socket) {
    return `${part.socket} board required`;
  }
  if (part.slot === "ram" && board && part.memory && board.memory && part.memory !== board.memory) {
    return `Needs ${board.memory}`;
  }
  if (part.slot === "gpu" && box && part.length) {
    const limit = psu?.psuForm === "atx" && box.gpuAtx ? box.gpuAtx : box.gpuMax;
    if (limit && part.length > limit) return `Too long for this case (${limit}mm)`;
  }
  if (part.slot === "psu" && box) {
    if (part.psuForm && box.psuForms && !box.psuForms.includes(part.psuForm)) return "Wrong PSU size";
    if (part.psuLen && box.psuMaxLen && part.psuLen > box.psuMaxLen) return "PSU is too long";
    const need = (cpu?.watts ?? 65) + (gpu?.watts ?? 75) + 120;
    if (part.watts && part.watts < need) return `Needs about ${need}W`;
  }
  if (part.slot === "cooler" && box) {
    if (part.rad && part.rad > 0 && !box.rads?.includes(part.rad)) return `${part.rad}mm radiator won't fit`;
    if (!part.rad && part.height && box.coolerMax && part.height > box.coolerMax) return "Cooler is too tall";
  }
  if (cooler && box && part.slot === "case") {
    if (cooler.rad && cooler.rad > 0 && !part.rads?.includes(cooler.rad)) return "";
  }
  return null;
}

export function tidyPick(pick: PickMap): PickMap {
  const next = { ...pick };
  for (let pass = 0; pass < 3; pass += 1) {
    for (const slot of SLOTS) {
      const id = next[slot.id];
      if (!id) continue;
      if (blockReason(partById[id], next)) next[slot.id] = null;
    }
  }
  return next;
}
