create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  path text not null,
  device text not null check (device in ('desktop', 'mobile')),
  user_id uuid null
);

create index if not exists page_views_created_at_idx on public.page_views (created_at desc);
create index if not exists page_views_device_created_at_idx on public.page_views (device, created_at desc);

