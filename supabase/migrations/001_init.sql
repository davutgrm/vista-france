-- ── Profiles (auth.users'ı genişletir) ───────────────────────────────────────
create table if not exists public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  email       text not null,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Kullanıcı kendi profilini okuyabilir"
  on public.profiles for select using (auth.uid() = id);

create policy "Kullanıcı kendi profilini güncelleyebilir"
  on public.profiles for update using (auth.uid() = id);

-- ── Listings ─────────────────────────────────────────────────────────────────
create table if not exists public.listings (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references public.profiles(id) on delete cascade not null,
  address      text not null,
  district     text,
  price        text,
  beds         int default 0,
  area         int default 0,
  status       text default 'queued' check (status in ('queued','enhancing','staged','ready')),
  photos       int default 0,
  video        boolean default false,
  tour         boolean default false,
  hue          text default '255',
  scene        text default 'city',
  enhanced_url text,
  staged_url   text,
  video_url    text,
  created_at   timestamptz default now() not null,
  updated_at   timestamptz default now() not null
);

alter table public.listings enable row level security;

create policy "Kullanıcı kendi ilanlarını okuyabilir"
  on public.listings for select using (auth.uid() = user_id);

create policy "Kullanıcı ilan ekleyebilir"
  on public.listings for insert with check (auth.uid() = user_id);

create policy "Kullanıcı kendi ilanını güncelleyebilir"
  on public.listings for update using (auth.uid() = user_id);

create policy "Kullanıcı kendi ilanını silebilir"
  on public.listings for delete using (auth.uid() = user_id);

-- ── Trigger: yeni kullanıcıda otomatik profil oluştur ────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
