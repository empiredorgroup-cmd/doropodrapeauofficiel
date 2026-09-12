import type {MetadataRoute} from 'next';
import {createPublicClient} from '@/lib/supabase/public';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://doropo-drapeau-officiel.vercel.app';
  const routes = ['', 'dd-parleur', 'nos-domaines', 'nos-activites', 'nos-membres', 'nos-partenaires', 'qui-sommes-nous', 'nous-rejoindre', 'nous-soutenir', 'bilans', 'galerie', 'contacts']
    .map(path => ({url: `${base}/${path}`, changeFrequency: 'monthly' as const, priority: path === '' ? 1 : .7}));

  const supabase = createPublicClient();
  const {data} = await supabase.from('activities').select('slug, status');
  const activityRoutes = (data ?? []).map(a => ({
    url: `${base}/nos-activites/${a.slug}`,
    changeFrequency: 'monthly' as const,
    priority: a.status === 'announced' ? .9 : .6,
  }));

  return [...routes, ...activityRoutes];
}
