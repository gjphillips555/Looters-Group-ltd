alter table staff_settings add column if not exists printful_token text not null default '';
alter table staff_settings add column if not exists printful_store_id text not null default '';
alter table staff_settings add column if not exists bank_name text not null default '';
alter table staff_settings add column if not exists bank_account text not null default '';
alter table staff_settings add column if not exists payee_name text not null default 'Looters Group';

alter table apparel_orders add column if not exists phone text not null default '';
alter table apparel_orders add column if not exists address1 text not null default '';
alter table apparel_orders add column if not exists address2 text not null default '';
alter table apparel_orders add column if not exists city text not null default '';
alter table apparel_orders add column if not exists postcode text not null default '';
alter table apparel_orders add column if not exists status text not null default 'awaiting_payment';
alter table apparel_orders add column if not exists printful_id text not null default '';
alter table apparel_orders add column if not exists printful_error text not null default '';
alter table apparel_orders add column if not exists shipping_cents integer not null default 1200;
alter table apparel_orders add column if not exists total_cents integer not null default 0;
