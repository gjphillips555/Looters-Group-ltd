import assert from "node:assert/strict";
import { test } from "node:test";
import {
  productBrand,
  productKind,
} from "./product-search.ts";
import type { Product } from "./products.ts";

function item(
  title: string,
  extra: Partial<Product> = {},
): Product {
  return {
    id: "1",
    title,
    categoryPath: extra.categoryPath ?? null,
    categoryNumber: extra.categoryNumber ?? null,
    categoryName: extra.categoryName ?? null,
    priceLabel: "$1",
    amount: 1,
    buyNow: true,
    photo: null,
    photos: [],
    region: null,
    suburb: null,
    listingUrl: "",
    isNew: false,
    shipping: [],
    maxQty: 1,
    description: extra.description ?? null,
    attributes: extra.attributes ?? [],
    viewCount: null,
  };
}

function kind(title: string, extra?: Partial<Product>) {
  return productKind(item(title, extra));
}

test("without a stamp the product is uncategorised", () => {
  assert.equal(
    kind("GigaByte Gaming - Intel i7 | DDR4 | NVMe SSD | Nitro R7 360 | Windows 11 Pro"),
    null,
  );
  assert.equal(kind("Dell Latitude 7490 i5 8GB"), null);
  assert.equal(kind("HP Laptop Charger 19V 65W"), null);
});

test("title stamps are the only category guide", () => {
  assert.equal(kind("L4 HP ProDesk 400 G4 SFF Desktop"), "laptops");
  assert.equal(kind("D3 Dell Latitude 7490 Laptop"), "desktops");
  assert.equal(kind("C0 HP EliteBook 840 G5"), "components");
  assert.equal(kind("HP EliteBook [L4] i5"), "laptops");
  assert.equal(kind("M0 Dell 24 LCD Monitor"), null);
  assert.equal(kind("L0 spare heatsink"), null);
  assert.equal(kind("HP ProDesk 400 G4 SFF Desktop"), null);
});

test("brand detection from title and attributes", () => {
  assert.equal(productBrand(item("Refurbished HP 11-k009tu Laptop")), "HP");
  assert.equal(productBrand(item("GigaByte Gaming - Intel i7")), "GIGABYTE");
  assert.equal(
    productBrand(
      item("Gaming PC", {
        attributes: [{ name: "Brand", value: "ASUS" }],
      }),
    ),
    "ASUS",
  );
});
