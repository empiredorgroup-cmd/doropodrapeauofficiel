-- DOROPO DRAPEAU — Migration 0002 : stockage des médias des actualités
-- À exécuter dans Supabase → SQL Editor → New snippet → Run (une seule fois),
-- APRÈS avoir déjà exécuté 0001_init.sql.

insert into storage.buckets (id, name, public)
values ('news-media', 'news-media', true)
on conflict (id) do nothing;

-- Lecture publique des fichiers de ce bucket (les images/vidéos des actualités publiées
-- doivent être visibles par tout le monde sur le site public).
create policy "public lit news-media" on storage.objects
  for select using (bucket_id = 'news-media');

-- Seul l'admin peut ajouter/modifier/supprimer des fichiers dans ce bucket.
create policy "admin gère news-media" on storage.objects
  for all using (bucket_id = 'news-media' and public.is_admin())
  with check (bucket_id = 'news-media' and public.is_admin());
