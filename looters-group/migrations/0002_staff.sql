create table if not exists staff_settings (
  id integer primary key,
  owner_email text not null default ''
);
insert into staff_settings (id, owner_email) values (1, '')
  on conflict (id) do nothing;

create table if not exists staff_members (
  user_id text primary key,
  email text,
  name text,
  approved_at timestamptz not null default now()
);

create table if not exists staff_requests (
  id serial primary key,
  user_id text not null,
  email text,
  name text,
  note text not null default '',
  token text not null unique,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
create index if not exists staff_requests_token_idx on staff_requests (token);
create index if not exists staff_requests_user_idx on staff_requests (user_id);
