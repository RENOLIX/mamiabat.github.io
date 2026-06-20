begin;

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title_fr text not null check (char_length(trim(title_fr)) > 0),
  title_en text not null check (char_length(trim(title_en)) > 0),
  description_fr text not null check (char_length(trim(description_fr)) > 0),
  description_en text not null check (char_length(trim(description_en)) > 0),
  image_paths text[] not null default '{}',
  published boolean not null default true,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists news_set_updated_at on public.news;
create trigger news_set_updated_at
before update on public.news
for each row execute function public.set_updated_at();

create or replace function public.handle_new_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.admin_profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), '')
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(excluded.full_name, public.admin_profiles.full_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_whtl on auth.users;
create trigger on_auth_user_created_whtl
after insert or update of email, raw_user_meta_data on auth.users
for each row execute function public.handle_new_admin();

insert into public.admin_profiles (id, email, full_name)
select
  id,
  coalesce(email, ''),
  nullif(trim(coalesce(raw_user_meta_data ->> 'full_name', '')), '')
from auth.users
where email is not null
on conflict (id) do nothing;

alter table public.news enable row level security;
alter table public.admin_profiles enable row level security;

drop policy if exists "Public reads published news" on public.news;
create policy "Public reads published news"
on public.news
for select
to anon, authenticated
using (published = true or auth.role() = 'authenticated');

drop policy if exists "Admins insert news" on public.news;
create policy "Admins insert news"
on public.news
for insert
to authenticated
with check (auth.uid() is not null);

drop policy if exists "Admins update news" on public.news;
create policy "Admins update news"
on public.news
for update
to authenticated
using (auth.uid() is not null)
with check (auth.uid() is not null);

drop policy if exists "Admins delete news" on public.news;
create policy "Admins delete news"
on public.news
for delete
to authenticated
using (auth.uid() is not null);

drop policy if exists "Admins read profiles" on public.admin_profiles;
create policy "Admins read profiles"
on public.admin_profiles
for select
to authenticated
using (auth.uid() is not null);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'news-images',
  'news-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public reads news images" on storage.objects;
create policy "Public reads news images"
on storage.objects
for select
to public
using (bucket_id = 'news-images');

drop policy if exists "Admins upload news images" on storage.objects;
create policy "Admins upload news images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'news-images' and auth.uid() is not null);

drop policy if exists "Admins update news images" on storage.objects;
create policy "Admins update news images"
on storage.objects
for update
to authenticated
using (bucket_id = 'news-images' and auth.uid() is not null)
with check (bucket_id = 'news-images' and auth.uid() is not null);

drop policy if exists "Admins delete news images" on storage.objects;
create policy "Admins delete news images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'news-images' and auth.uid() is not null);

grant usage on schema public to anon, authenticated;
grant select on public.news to anon;
grant select, insert, update, delete on public.news to authenticated;
grant select on public.admin_profiles to authenticated;

commit;
