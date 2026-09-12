import type {Metadata} from 'next';
import {ActivityBrowser} from '@/components/activity-browser';
import type {Activity} from '@/lib/content';
import {FALLBACK_IMAGE} from '@/lib/content';
import {createClient} from '@/lib/supabase/server';
import {legacyActivityMedia} from '@/lib/legacy-media-bridge';

export const metadata: Metadata = {title: 'Nos activités', description: 'Activités passées et annonces de DOROPO DRAPEAU à Doropo.'};
export const dynamic = 'force-dynamic';

type ActivityDbRow = {
  id: string; slug: string; title: string; description: string | null; status: 'past' | 'announced';
  event_date: string | null; location: string | null; cover_image_url: string | null; display_order: number;
};

export default async function Page() {
  const supabase = await createClient();
  const {data} = await supabase.from('activities').select('*').order('display_order', {ascending: true});
  const rows = (data ?? []) as ActivityDbRow[];

  const items: Activity[] = rows.map(r => ({
    id: r.slug,
    title: r.title,
    status: r.status,
    dateLabel: r.event_date ? new Date(r.event_date).toLocaleDateString('fr-FR', {day: '2-digit', month: 'long', year: 'numeric'}) : 'Date à venir',
    place: r.location || 'Lieu à venir',
    tag: r.status === 'announced' ? 'Annonce' : 'Archives',
    summary: r.description || '',
  }));

  const covers: Record<string, string> = {};
  for (const r of rows) {
    covers[r.slug] = r.cover_image_url || legacyActivityMedia(r.slug).find(m => m.type === 'image')?.src || FALLBACK_IMAGE;
  }

  return (
    <main>
      <section className="section page-hero">
        <div className="container">
          <div className="eyebrow">DOROPO DRAPEAU · ACTIVITÉS</div>
          <h1 className="title">Nos activités</h1>
          <p className="lead">Découvrez les actions menées par DOROPO DRAPEAU et les annonces des prochains rendez-vous.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ActivityBrowser items={items} covers={covers} />
        </div>
      </section>
    </main>
  );
}
