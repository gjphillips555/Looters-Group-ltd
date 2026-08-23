-- SiftaLoot wallets live on Looters Group so members can use credit
-- without Sifta Browser. user_id is Better Auth text (incl. 'dev-user').

create table if not exists sifta_wallets (
  user_id    text primary key,
  balance    integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists sifta_ledger (
  id         serial primary key,
  user_id    text not null,
  amount     integer not null,
  kind       text not null,
  note       text not null default '',
  code       text,
  status     text not null default 'posted',
  created_at timestamptz not null default now()
);

create index if not exists sifta_ledger_user_id_idx on sifta_ledger (user_id);
create index if not exists sifta_ledger_code_idx on sifta_ledger (code);
