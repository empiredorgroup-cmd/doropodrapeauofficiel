-- DOROPO DRAPEAU — Migration 0004 : stockage partagé (membres/partenaires/activités) + colonnes manquantes
-- À exécuter dans Supabase → SQL Editor → New snippet → Run (une seule fois),
-- APRÈS 0001_init.sql, 0002_news_storage.sql et 0003_seed_content.sql.

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

create policy "public lit site-media" on storage.objects
  for select using (bucket_id = 'site-media');

create policy "admin gère site-media" on storage.objects
  for all using (bucket_id = 'site-media' and public.is_admin())
  with check (bucket_id = 'site-media' and public.is_admin());

-- Le site affichait des dates libres ("Mars à mai 2026", "Date à venir") et un badge de catégorie
-- ("EXCELLIA", "Vie associative"...) pour chaque activité : ces deux informations n'existaient pas
-- encore comme colonnes dédiées dans la table activities.
alter table public.activities add column if not exists date_label text;
alter table public.activities add column if not exists tag text;
