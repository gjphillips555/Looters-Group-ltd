create table if not exists the_room (
  id bigint generated always as identity primary key,
  parent_id bigint,
  seat text not null,
  handle text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists the_room_created_at_idx on the_room (created_at desc);

create table if not exists the_room_gate (
  id int primary key,
  next_ok_at timestamptz not null default to_timestamp(0),
  last_seat text
);

insert into the_room_gate (id, next_ok_at)
values (1, to_timestamp(0))
on conflict (id) do nothing;
