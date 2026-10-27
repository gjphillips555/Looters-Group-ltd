create table if not exists siftah_rooms (
  code text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  messages jsonb not null default '[]'::jsonb
);

create index if not exists siftah_rooms_updated_at_idx on siftah_rooms (updated_at desc);
