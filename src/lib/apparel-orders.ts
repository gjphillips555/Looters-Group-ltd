import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";

export type ApparelOrder = {
  id: number;
  product_id: string;
  title: string;
  size: string;
  qty: number;
  name: string;
  email: string;
  note: string;
  created_at: string;
};

export const requestApparel = createServerFn({ method: "POST" })
  .validator((d: { productId: string; title: string; size: string; qty: number; name: string; email: string; note: string }) => ({
    productId: d.productId.trim(),
    title: d.title.trim(),
    size: d.size.trim().toUpperCase(),
    qty: Math.min(6, Math.max(1, Number(d.qty) || 1)),
    name: d.name.trim().slice(0, 80),
    email: d.email.trim().slice(0, 120),
    note: d.note.trim().slice(0, 400),
  }))
  .handler(async ({ data }) => {
    if (!data.name || !data.email.includes("@") || !data.size) {
      return { ok: false as const };
    }
    const sql = await getSql();
    await sql`
      insert into apparel_orders (product_id, title, size, qty, name, email, note)
      values (${data.productId}, ${data.title}, ${data.size}, ${data.qty}, ${data.name}, ${data.email}, ${data.note})
    `;
    return { ok: true as const };
  });

export const listApparelOrders = createServerFn({ method: "POST" })
  .validator((pin: string) => pin)
  .handler(async ({ data: pin }) => {
    if (pin !== "Staff") throw new Error("Unauthorized");
    const sql = await getSql();
    return sql<ApparelOrder>`
      select id, product_id, title, size, qty, name, email, note, created_at::text as created_at
      from apparel_orders
      order by id desc
      limit 50
    `;
  });
