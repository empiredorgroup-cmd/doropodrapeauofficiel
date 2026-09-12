// SERVER-ONLY — pont de transition vers Supabase.
// Tant que l'admin n'a pas encore téléversé de nouvelle photo pour un membre/partenaire/activité
// (photo_url / logo_url / cover_image_url vide en base), le site public continue d'afficher
// l'ancienne photo déjà en place via le système de détection tolérante existant. Dès qu'une
// vraie photo est téléversée depuis l'admin, elle prend le dessus automatiquement.
import {resolveMemberMedia, resolvePartnerMedia, resolveActivityMedia, type MediaItem} from '@/lib/media-resolver';

const MEMBER_PHOTO_TOKENS: Record<string, string> = {
  'KAMBIRE SIE': 'Fondateur',
  'LANTA LEZO ANNE': 'Lanta',
  'KAMBIRE DISSOURTE': 'Dissourté',
  'KAMBOU TOHO PHILIPPE': 'philippe',
  'SIB SAMI': 'sami',
  'KAMBOU SIE FRANCK': 'franck',
  'DIBLONI ROCK ELVIS': 'elvis',
  'PALE DOMINIQUE': 'dominique',
  'KAMBIRE ABOUDRAMANE': 'aboudramane',
  'KAMBOU KPEKPE ERIC': 'Éric',
  'SIB OLLO JEAN LUC': 'luc',
  'NOUFE INI JULIENNE': 'julienne',
  'SORO ERNEST': 'Soro',
  'DJANE ESTHER': 'esther',
  'NOUFE NESTOR': 'nestor',
  'HIEN MATHIEU': 'mathieu',
  'NOUFE OLO MARCELIN': 'marcelin',
  'TRAORE AWA': 'Awa traore',
  'COULIBALY IBRAHIM': 'ibrahim',
  'KAMBOU DAVID': 'david',
  'KAMBOU LAZARE': 'lazare',
  'SIB OLLO ARNAUD': 'arnaud',
  'DAH HOHO SABINE': 'sabine',
};

const PARTNER_LOGO_TOKENS: Record<string, string> = {
  'E.O.S Station': 'Partenaire 1',
  'TEEKONTEEN': 'Partenaire 2',
  'EMPIRE D’OR': 'Partenaire 3',
  'RALLY CLUB VIP': 'Partenaire 4',
  'INDIGO Côte d’Ivoire': 'Partenaire 5',
  'Cercle Artistique et Culturel Le Soleil de Doropo': 'Partenaire 6',
};

const ACTIVITY_LEGACY_MEDIA: Record<string, {prefix: string; count: number}> = {
  'formation-bureau': {prefix: 'Format-bureau', count: 5},
  'ag-n1': {prefix: 'AG', count: 9},
  'sensibilisation-elections': {prefix: 'Sensibilisation', count: 10},
  'formation-excellia': {prefix: 'Format-EXCELLIA', count: 10},
  'preselection-excellia': {prefix: 'Présélection', count: 8},
  'final-excellia': {prefix: 'Final', count: 10},
  'ag-n2': {prefix: 'AGA', count: 10},
  'nuit-retro': {prefix: 'Rétro', count: 1},
  'excellia-2': {prefix: 'EXCELLIA 2', count: 1},
};

export function legacyMemberPhoto(fullName: string): string | null {
  const token = MEMBER_PHOTO_TOKENS[fullName];
  if (!token) return null;
  return resolveMemberMedia(token)?.src ?? null;
}

export function legacyPartnerLogo(name: string): string | null {
  const token = PARTNER_LOGO_TOKENS[name];
  if (!token) return null;
  return resolvePartnerMedia(token)?.src ?? null;
}

export function legacyActivityMedia(slug: string): MediaItem[] {
  const entry = ACTIVITY_LEGACY_MEDIA[slug];
  if (!entry) return [];
  return resolveActivityMedia(entry.prefix, entry.count);
}
