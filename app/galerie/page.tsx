import type {Metadata} from 'next';
import {GalleryView} from '@/components/gallery-view';
import {createClient} from '@/lib/supabase/server';
import {legacyActivityMedia} from '@/lib/legacy-media-bridge';

export const metadata: Metadata = {title: 'Toute la galerie', description: 'Galerie des médias et de l’identité visuelle de DOROPO DRAPEAU.'};
export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = await createClient();
  const {data: activities} = await supabase
    .from('activities')
    .select('id, slug, title')
    .order('display_order', {ascending: true});

  const media: {id: string; src: string; type: 'image' | 'video'; alt: string}[] = [];

  for (const a of activities ?? []) {
    const {data: rows} = await supabase
      .from('activity_media')
      .select('media_url, media_type')
      .eq('activity_id', a.id)
      .order('display_order', {ascending: true});

    let items = (rows ?? []).map(m => ({src: m.media_url as string, type: m.media_type as 'image' | 'video'}));
    if (items.length === 0) items = legacyActivityMedia(a.slug);

    items.forEach((m, i) => media.push({id: `${a.slug}-${i}`, src: m.src, type: m.type, alt: `${a.title} — média ${i + 1}`}));
  }

  return (
    <main>
      <section className="section page-hero">
        <div className="container">
          <div className="eyebrow">Médias</div>
          <h1 className="title">Toute la galerie</h1>
          <p className="lead">Les photos et vidéos de toutes les activités de DOROPO DRAPEAU, réunies en un seul endroit.</p>
        </div>
      </section>
      <section className="section">
        <div className="container"><GalleryView media={media} /></div>
      </section>
    </main>
  );
}
