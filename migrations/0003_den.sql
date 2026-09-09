create table if not exists den_users (
  id text primary key,
  username text not null unique,
  email text not null,
  password_hash text,
  google_id text,
  status text not null default 'pending_puzzle',
  puzzle_token text unique,
  puzzle_tries int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists den_dms (
  id text primary key,
  created_at timestamptz not null default now(),
  author text not null,
  body text not null,
  kind text not null default 'signup'
);

create index if not exists den_users_status_idx on den_users (status);
create index if not exists den_dms_created_at_idx on den_dms (created_at desc);
