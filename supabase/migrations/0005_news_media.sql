-- DOROPO DRAPEAU — Migration 0005 : galerie multi-médias pour les actualités
-- À exécuter dans Supabase → SQL Editor → New snippet → Run (une seule fois),
-- APRÈS 0001 à 0004.
-- (activity_media existe déjà depuis 0001_init.sql — il manquait son équivalent pour les actualités.)

create table public.news_media (
  id uuid primary key default gen_random_uuid(),
  news_id uuid not null references public.news(id) on delete cascade,
  media_url text not null,
  media_type text not null check (media_type in ('image', 'video')),
  display_order int not null default 0,
  created_at timestamptz not null default now()
);
create index news_media_news_idx on public.news_media(news_id, display_order);

alter table public.news_media enable row level security;

create policy "public voit les médias d'une actualité publiée" on public.news_media
  for select using (exists(select 1 from public.news n where n.id = news_id and n.status = 'published'));

create policy "admin gère les médias d'actualité" on public.news_media
  for all using (public.is_admin()) with check (public.is_admin());
