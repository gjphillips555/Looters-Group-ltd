import { createServerFn } from "@tanstack/react-start";
import { randomBytes } from "node:crypto";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";

export type StaffRequestRow = {
  id: number;
  user_id: string;
  email: string | null;
  name: string | null;
  note: string;
  token: string;
  status: string;
  created_at: string;
};

async function userProfile(userId: string) {
  const sql = await getSql();
  const rows = await sql<{ name: string; email: string }>`
    select name, email from "user" where id = ${userId}
  `;
  return rows[0] ?? { name: "Staff applicant", email: "" };
}

async function sendOwnerMail(to: string, subject: string, message: string) {
  if (!to.includes("@")) return false;
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: "Looters Group",
        _subject: subject,
        message,
        _template: "box",
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export const getStaffStatus = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ user_id: string }>`
      select user_id from staff_members where user_id = ${context.userId}
    `;
    return { staff: rows.length > 0, userId: context.userId };
  });

export const getOwnerEmail = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{ owner_email: string }>`
    select owner_email from staff_settings where id = 1
  `;
  return { ownerEmail: rows[0]?.owner_email ?? "" };
});

export const setOwnerEmail = createServerFn({ method: "POST" })
  .validator((d: { email: string; pin: string }) => ({
    email: d.email.trim(),
    pin: d.pin,
  }))
  .handler(async ({ data }) => {
    if (data.pin !== "Staff") throw new Error("Unauthorized");
    const sql = await getSql();
    await sql`
      insert into staff_settings (id, owner_email) values (1, ${data.email})
      on conflict (id) do update set owner_email = ${data.email}
    `;
    return { ownerEmail: data.email };
  });

export const applyForStaff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { note: string; origin: string }) => ({
    note: d.note.trim().slice(0, 800),
    origin: d.origin.replace(/\/+$/, ""),
  }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const existing = await sql<{ user_id: string }>`
      select user_id from staff_members where user_id = ${context.userId}
    `;
    if (existing.length) return { ok: true, already: true, mailed: false };

    const pending = await sql<{ id: number }>`
      select id from staff_requests
      where user_id = ${context.userId} and status = 'pending'
    `;
    if (pending.length) return { ok: true, already: false, mailed: false, pending: true };

    const profile = await userProfile(context.userId);
    const token = randomBytes(24).toString("hex");
    await sql`
      insert into staff_requests (user_id, email, name, note, token, status)
      values (${context.userId}, ${profile.email}, ${profile.name}, ${data.note}, ${token}, 'pending')
    `;

    const settings = await sql<{ owner_email: string }>`
      select owner_email from staff_settings where id = 1
    `;
    const owner = settings[0]?.owner_email ?? "";
    const approveUrl = `${data.origin}/staff/approve?token=${token}`;
    const message = [
      "Someone asked for Looters staff access.",
      "",
      `Name: ${profile.name}`,
      `Email: ${profile.email}`,
      `Note: ${data.note || "(none)"}`,
      "",
      "Only you can grant this. Open this link and press Grant access:",
      approveUrl,
    ].join("\n");
    const mailed = owner ? await sendOwnerMail(owner, "Looters staff access request", message) : false;
    return { ok: true, already: false, mailed, pending: false };
  });

export const peekStaffRequest = createServerFn({ method: "GET" })
  .validator((token: string) => token)
  .handler(async ({ data: token }) => {
    const sql = await getSql();
    const rows = await sql<StaffRequestRow>`
      select id, user_id, email, name, note, token, status, created_at::text as created_at
      from staff_requests where token = ${token}
    `;
    const row = rows[0];
    if (!row) return null;
    return {
      name: row.name,
      email: row.email,
      note: row.note,
      status: row.status,
    };
  });

export const grantStaffAccess = createServerFn({ method: "POST" })
  .validator((token: string) => token)
  .handler(async ({ data: token }) => {
    const sql = await getSql();
    const rows = await sql<StaffRequestRow>`
      select id, user_id, email, name, note, token, status, created_at::text as created_at
      from staff_requests where token = ${token}
    `;
    const row = rows[0];
    if (!row) return { ok: false, reason: "missing" as const };
    if (row.status === "approved") return { ok: true, reason: "already" as const };

    await sql`
      insert into staff_members (user_id, email, name)
      values (${row.user_id}, ${row.email}, ${row.name})
      on conflict (user_id) do nothing
    `;
    await sql`
      update staff_requests set status = 'approved' where token = ${token}
    `;
    return { ok: true, reason: "granted" as const, name: row.name };
  });

export const listPendingStaff = createServerFn({ method: "POST" })
  .validator((pin: string) => pin)
  .handler(async ({ data: pin }) => {
    if (pin !== "Staff") throw new Error("Unauthorized");
    const sql = await getSql();
    return sql<StaffRequestRow>`
      select id, user_id, email, name, note, token, status, created_at::text as created_at
      from staff_requests
      where status = 'pending'
      order by id desc
    `;
  });
