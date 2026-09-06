// SERVER-ONLY — ce fichier utilise `fs` et ne doit jamais être importé par un composant 'use client'.
// Il scanne les vrais fichiers présents dans public/images/... au moment du build (npm run build)
// et les fait correspondre à un "jeton" attendu (ex. "AG 3", "Partenaire 2", "sami") en ignorant :
// - la différence espace / tiret / underscore ("AG 3" = "AG-3" = "AG_3")
// - la casse (jpg = JPG = Jpg)
// - l'extension exacte (.jpg, .jpeg, .png, .webp pour les images ; .mp4, .webm, .mov pour les vidéos)
// Si le fichier n'existe pas encore, la fonction renvoie null : rien n'est inventé, l'appelant
// décide alors d'afficher un repli (logo) ou de ne rien afficher.
import fs from 'fs';
import path from 'path';

const MEDIA_ROOT = path.join(process.cwd(), 'public', 'images');
const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov)$/i;

export type MediaItem = {src: string; type: 'image' | 'video'};

function listDir(sub: string): string[] {
  try {
    return fs.readdirSync(path.join(MEDIA_ROOT, sub));
  } catch {
    return [];
  }
}

function normalize(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[\s_-]+/g, '');
}

/** Cherche dans public/images/<sub>/ un fichier dont le nom (sans extension) correspond à `token`. */
export function findMedia(sub: string, token: string): MediaItem | null {
  const target = normalize(token);
  for (const f of listDir(sub)) {
    const ext = path.extname(f);
    const base = f.slice(0, -ext.length || undefined);
    if (normalize(base) !== target) continue;
    if (IMAGE_EXT.test(f)) return {src: `/images/${sub}/${f}`, type: 'image'};
    if (VIDEO_EXT.test(f)) return {src: `/images/${sub}/${f}`, type: 'video'};
  }
  return null;
}

/** Résout tous les médias numérotés d'une activité (ex. prefix="AG", count=9 → AG 1..AG 9). */
export function resolveActivityMedia(mediaPrefix: string | undefined, mediaCount: number | undefined): MediaItem[] {
  if (!mediaPrefix || !mediaCount) return [];
  const items: MediaItem[] = [];
  for (let i = 1; i <= mediaCount; i++) {
    const m = findMedia('activites', `${mediaPrefix} ${i}`);
    if (m) items.push(m);
  }
  return items;
}

export function resolvePartnerMedia(file: string): MediaItem | null {
  return findMedia('partenaires', file);
}

export function resolveMemberMedia(photo: string): MediaItem | null {
  return findMedia('membres', photo);
}
