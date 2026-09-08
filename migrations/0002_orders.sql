create table if not exists shop_orders (
  id text primary key,
  created_at timestamptz not null default now(),
  customer jsonb not null,
  lines jsonb not null,
  subtotal numeric not null,
  shipping_total numeric not null,
  total numeric not null,
  source text not null default 'cart',
  paid boolean not null default false
);

create index if not exists shop_orders_created_at_idx on shop_orders (created_at desc);
