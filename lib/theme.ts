// Fait varier le logo (en-tête/footer) et la teinte de fond de certaines sections selon la page visitée.
// Pas de fs ici : ce fichier est importé par des composants 'use client' (site-header, site-footer).
export type PageTheme = 'default' | 'sunburst' | 'tricolor' | 'emerald';

export const THEME_LOGO: Record<PageTheme, string> = {
  default: '/images/Logo 1.jpeg',
  sunburst: '/images/Logo 3.jpeg',
  tricolor: '/images/Logo 4.jpeg',
  emerald: '/images/Logo 5.jpeg',
};

const SUNBURST = ['/nos-activites', '/galerie', '/dd-parleur'];
const TRICOLOR = ['/qui-sommes-nous', '/nos-membres', '/nos-partenaires', '/nos-domaines'];
const EMERALD = ['/nous-rejoindre', '/nous-soutenir', '/bilans', '/contacts'];

export function themeForPath(pathname: string): PageTheme {
  if (SUNBURST.some(p => pathname.startsWith(p))) return 'sunburst';
  if (TRICOLOR.some(p => pathname.startsWith(p))) return 'tricolor';
  if (EMERALD.some(p => pathname.startsWith(p))) return 'emerald';
  return 'default';
}
