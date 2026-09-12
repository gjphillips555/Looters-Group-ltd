import assert from "node:assert/strict";
import { test } from "node:test";
import {
  productBrand,
  productKind,
  type ShopCategoryId,
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

function kind(title: string, extra?: Partial<Product>): ShopCategoryId {
  return productKind(item(title, extra));
}

test("whole PCs with SSD/RAM in the title stay desktops", () => {
  assert.equal(
    kind("GigaByte Gaming - Intel i7 | DDR4 | NVMe SSD | Nitro R7 360 | Windows 11 Pro"),
    "desktops",
  );
  assert.equal(
    kind("HP ProDesk 400 G4 SFF – Intel Core i5 Business Desktop - Refurbished"),
    "desktops",
  );
});

test("laptops are not desktops or parts", () => {
  assert.equal(
    kind("Refurbished HP 11-k009tu Laptop – Windows 10 – Includes Charger – Warranty"),
    "laptops",
  );
  assert.equal(kind("Dell Latitude 7490 i5 8GB"), "laptops");
  assert.equal(kind("Lenovo ThinkPad T480"), "laptops");
});

test("laptop accessories are components", () => {
  assert.equal(kind("HP Laptop Charger 19V 65W"), "components");
  assert.equal(kind("Laptop bag 15.6 inch"), "components");
});

test("parts are components even under a desktop TradeMe path", () => {
  assert.equal(
    kind("Samsung 1TB NVMe SSD", {
      categoryPath: "/Computers/Desktops",
      categoryNumber: "0002-4715",
    }),
    "components",
  );
  assert.equal(kind('Dell 24" LCD Monitor'), "components");
});

test("TradeMe laptop tree without a laptop title is a part", () => {
  assert.equal(
    kind("Dell 65W USB-C charger", {
      categoryPath: "/Computers/Laptops/Chargers",
      categoryNumber: "0002-0356-0199",
    }),
    "components",
  );
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
