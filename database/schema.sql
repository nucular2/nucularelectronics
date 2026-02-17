create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  external_id text unique,
  name text not null,
  price numeric(12,2) not null,
  stock int not null default 0,
  updated_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  status text not null,
  total numeric(12,2) not null,
  created_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  qty int not null,
  price numeric(12,2) not null
);
