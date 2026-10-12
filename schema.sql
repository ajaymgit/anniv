-- ========================================================
-- CoupleStick: Supabase Schema & Realtime Configuration
-- ========================================================

create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.couples (
  id uuid default gen_random_uuid() primary key,
  partner_a uuid references public.profiles(id) on delete cascade not null,
  partner_b uuid references public.profiles(id) on delete cascade,
  pairing_code text unique not null,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.reactions_queue (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references public.couples(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  action text not null,
  asset_id text,
  popup_photo_url text,
  message text,
  is_delivered boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;
alter table public.couples enable row level security;
alter table public.reactions_queue enable row level security;

create policy "Users can read profiles of themselves and partner"
  on public.profiles for select
  using (
    auth.uid() = id or
    exists (
      select 1 from public.couples
      where (partner_a = auth.uid() or partner_b = auth.uid())
      and (partner_a = profiles.id or partner_b = profiles.id)
    )
  );

create policy "Couples can access their own pair"
  on public.couples for all
  using (partner_a = auth.uid() or partner_b = auth.uid());

create policy "Couples can access queued reactions"
  on public.reactions_queue for all
  using (
    exists (
      select 1 from public.couples
      where id = reactions_queue.couple_id
      and (partner_a = auth.uid() or partner_b = auth.uid())
    )
  );

alter publication supabase_realtime add table public.reactions_queue;
