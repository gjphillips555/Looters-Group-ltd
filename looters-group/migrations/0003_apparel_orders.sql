create table if not exists apparel_orders (
  id serial primary key,
  product_id text not null,
  title text not null,
  size text not null,
  qty integer not null default 1,
  name text not null,
  email text not null,
  note text not null default '',
  created_at timestamptz not null default now()
);
