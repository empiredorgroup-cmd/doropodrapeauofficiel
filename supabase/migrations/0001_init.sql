-- DOROPO DRAPEAU — Schéma initial (Phase 1)
-- À exécuter une seule fois dans Supabase → SQL Editor → New query → Run.
-- Toutes les tables prévues par la spec backend sont créées ici, même si l'admin ne pourra
-- gérer (créer/modifier) que les visiteurs et le tableau de bord en Phase 1. Les écrans
-- d'administration pour actualités / activités / membres / partenaires / bilans / galerie
-- arriveront en phases suivantes, une fois cette base validée.

create extension if not exists pgcrypto;

-- ==================================================
-- 1. ADMIN (un seul administrateur)
-- ==================================================
-- Après avoir créé le compte de l'administrateur dans Supabase → Authentication → Users,
-- viens copier son "User UID" et exécute :
--   insert into public.admins (user_id) values ('colle-l-uid-ici');
create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.admins where user_id = auth.uid());
$$;

-- ==================================================
-- 2. VISITEURS
-- ==================================================
create table public.visitors (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  phone text not null unique,
  email text,
  place text,
  visit_date date not null default current_date,
  visit_time time not null default current_time,
  created_at timestamptz not null default now()
);
create index visitors_created_at_idx on public.visitors(created_at desc);

-- ==================================================
-- 3. ACTUALITÉS — « LE DD PARLEUR »
-- ==================================================
create table public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  image_url text,
  video_url text,
  document_url text,
  event_date date,
  event_time time,
  location text,
  caption text,
  facebook_link text,
  status text not null default 'draft' check (status in ('draft','published')),
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index news_status_idx on public.news(status, created_at desc);

-- ==================================================
-- 4. ACTIVITÉS
-- ==================================================
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  detailed_description text,
  event_date date,
  event_time time,
  location text,
  status text not null check (status in ('past','announced')),
  cover_image_url text,
  video_url text,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.activity_media (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  media_url text not null,
  media_type text not null check (media_type in ('image','video')),
  display_order int not null default 0,
  created_at timestamptz not null default now()
);
create index activity_media_activity_idx on public.activity_media(activity_id, display_order);

-- ==================================================
-- 5. MEMBRES
-- ==================================================
create table public.members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text not null,
  description text,
  photo_url text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ==================================================
-- 6. PARTENAIRES
-- ==================================================
create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  responsible_name text,
  logo_url text,
  website_url text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ==================================================
-- 7. BILANS ANNUELS
-- ==================================================
create table public.annual_reports (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  title text not null,
  description text,
  pdf_url text not null,
  is_published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- ==================================================
-- 8. GALERIE GÉNÉRALE
-- ==================================================
create table public.gallery_media (
  id uuid primary key default gen_random_uuid(),
  media_url text not null,
  media_type text not null check (media_type in ('image','video')),
  caption text,
  activity_id uuid references public.activities(id) on delete set null,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ==================================================
-- RLS — activation
-- ==================================================
alter table public.admins enable row level security;
alter table public.visitors enable row level security;
alter table public.news enable row level security;
alter table public.activities enable row level security;
alter table public.activity_media enable row level security;
alter table public.members enable row level security;
alter table public.partners enable row level security;
alter table public.annual_reports enable row level security;
alter table public.gallery_media enable row level security;

-- admins : personne (à part l'admin lui-même en lecture de sa propre ligne) — géré uniquement via SQL Editor.
create policy "admin lit sa propre ligne" on public.admins for select using (user_id = auth.uid());

-- visitors : le public peut s'inscrire (insert), personne ne peut lire/modifier sauf l'admin.
create policy "public peut s'inscrire" on public.visitors for insert with check (true);
create policy "admin gère les visiteurs" on public.visitors for all using (public.is_admin()) with check (public.is_admin());

-- news : le public voit seulement les publiées, l'admin voit et gère tout.
create policy "public voit les actualités publiées" on public.news for select using (status = 'published');
create policy "admin gère les actualités" on public.news for all using (public.is_admin()) with check (public.is_admin());

-- activities / activity_media : publiques en lecture, gérées par l'admin.
create policy "public voit les activités" on public.activities for select using (true);
create policy "admin gère les activités" on public.activities for all using (public.is_admin()) with check (public.is_admin());
create policy "public voit les médias d'activité" on public.activity_media for select using (true);
create policy "admin gère les médias d'activité" on public.activity_media for all using (public.is_admin()) with check (public.is_admin());

-- members : public voit les actifs, admin gère tout.
create policy "public voit les membres actifs" on public.members for select using (is_active = true);
create policy "admin gère les membres" on public.members for all using (public.is_admin()) with check (public.is_admin());

-- partners : idem.
create policy "public voit les partenaires actifs" on public.partners for select using (is_active = true);
create policy "admin gère les partenaires" on public.partners for all using (public.is_admin()) with check (public.is_admin());

-- annual_reports : public voit les publiés, admin gère tout.
create policy "public voit les bilans publiés" on public.annual_reports for select using (is_published = true);
create policy "admin gère les bilans" on public.annual_reports for all using (public.is_admin()) with check (public.is_admin());

-- gallery_media : public en lecture, admin gère.
create policy "public voit la galerie" on public.gallery_media for select using (true);
create policy "admin gère la galerie" on public.gallery_media for all using (public.is_admin()) with check (public.is_admin());
