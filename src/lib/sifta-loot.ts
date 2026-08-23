import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";

const WELCOME_LOOT = 50;

export type SiftaLedger = {
  id: number;
  amount: number;
  kind: string;
  note: string;
  code: string | null;
  status: string;
  created_at: string;
};

export type SiftaWallet = {
  balance: number;
  ledger: SiftaLedger[];
};

export type SiftaRedeem = SiftaLedger & {
  user_id: string;
};

async function ensureWallet(userId: string) {
  const sql = await getSql();
  await sql`
    insert into sifta_wallets (user_id, balance)
    values (${userId}, 0)
    on conflict (user_id) do nothing
  `;
  const welcome = await sql<{ id: number }>`
    select id from sifta_ledger
    where user_id = ${userId} and kind = 'welcome'
    limit 1
  `;
  if (welcome.length === 0) {
    await sql`
      update sifta_wallets
      set balance = balance + ${WELCOME_LOOT}, updated_at = now()
      where user_id = ${userId}
    `;
    await sql`
      insert into sifta_ledger (user_id, amount, kind, note, status)
      values (
        ${userId},
        ${WELCOME_LOOT},
        'welcome',
        'Starter SiftaLoot — no Sifta Browser required',
        'posted'
      )
    `;
  }
}

async function readWallet(userId: string): Promise<SiftaWallet> {
  const sql = await getSql();
  const rows = await sql<{ balance: number }>`
    select balance from sifta_wallets where user_id = ${userId}
  `;
  const ledger = await sql<SiftaLedger>`
    select id, amount, kind, note, code, status, created_at::text as created_at
    from sifta_ledger
    where user_id = ${userId}
    order by id desc
    limit 30
  `;
  return { balance: rows[0]?.balance ?? 0, ledger };
}

export const getSiftaWallet = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureWallet(context.userId);
    return readWallet(context.userId);
  });

function mintCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "SL-";
  for (let i = 0; i < 6; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export const redeemSiftaLoot = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((amount: number) => Math.floor(Number(amount) || 0))
  .handler(async ({ context, data: amount }) => {
    if (amount < 5) return { ok: false as const, error: "Minimum 5 SiftaLoot." };
    await ensureWallet(context.userId);
    const sql = await getSql();
    const rows = await sql<{ balance: number }>`
      select balance from sifta_wallets where user_id = ${context.userId}
    `;
    const balance = rows[0]?.balance ?? 0;
    if (amount > balance) return { ok: false as const, error: "Not enough SiftaLoot." };
    const code = mintCode();
    await sql`
      update sifta_wallets
      set balance = balance - ${amount}, updated_at = now()
      where user_id = ${context.userId} and balance >= ${amount}
    `;
    await sql`
      insert into sifta_ledger (user_id, amount, kind, note, code, status)
      values (
        ${context.userId},
        ${-amount},
        'redeem',
        'Shop credit at Looters Stores / Trade Me',
        ${code},
        'pending'
      )
    `;
    const wallet = await readWallet(context.userId);
    return { ok: true as const, code, wallet };
  });

export const listSiftaRedeems = createServerFn({ method: "POST" })
  .validator((pin: string) => pin)
  .handler(async ({ data: pin }) => {
    if (pin !== "Staff") throw new Error("Unauthorized");
    const sql = await getSql();
    return sql<SiftaRedeem>`
      select id, user_id, amount, kind, note, code, status, created_at::text as created_at
      from sifta_ledger
      where kind = 'redeem'
      order by id desc
      limit 40
    `;
  });

export const honourSiftaRedeem = createServerFn({ method: "POST" })
  .validator((d: { pin: string; id: number }) => ({ pin: d.pin, id: Number(d.id) }))
  .handler(async ({ data }) => {
    if (data.pin !== "Staff") throw new Error("Unauthorized");
    const sql = await getSql();
    await sql`
      update sifta_ledger set status = 'honoured' where id = ${data.id} and kind = 'redeem'
    `;
    return { ok: true as const };
  });
