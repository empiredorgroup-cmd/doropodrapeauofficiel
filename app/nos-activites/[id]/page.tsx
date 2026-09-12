import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowLeft, CalendarDays, MapPin, Sparkles} from 'lucide-react';
import {FALLBACK_IMAGE} from '@/lib/content';
import {createClient} from '@/lib/supabase/server';
import {legacyActivityMedia} from '@/lib/legacy-media-bridge';
import {ClickableMedia} from '@/components/lightbox';
import {GalleryView} from '@/components/gallery-view';
import type {MediaItem} from '@/lib/media-resolver';

export const dynamic = 'force-dynamic';

type ActivityDbRow = {
  id: string; slug: string; title: string; description: string | null; detailed_description: string | null;
  status: 'past' | 'announced'; event_date: string | null; event_time: string | null; location: string | null;
  cover_image_url: string | null;
};

export async function generateMetadata({params}: {params: Promise<{id: string}>}): Promise<Metadata> {
  const {id} = await params;
  const supabase = await createClient();
  const {data} = await supabase.from('activities').select('title, description').eq('slug', id).maybeSingle();
  return data ? {title: data.title, description: data.description ?? undefined} : {title: 'Activité introuvable'};
}

export default async function Page({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const supabase = await createClient();
  const {data} = await supabase.from('activities').select('*').eq('slug', id).maybeSingle();
  if (!data) notFound();
  const a = data as ActivityDbRow;

  const {data: mediaRows} = await supabase
    .from('activity_media')
    .select('media_url, media_type')
    .eq('activity_id', a.id)
    .order('display_order', {ascending: true});

  let media: MediaItem[] = (mediaRows ?? []).map(m => ({src: m.media_url, type: m.media_type as 'image' | 'video'}));
  if (media.length === 0) media = legacyActivityMedia(a.slug);

  const cover = a.cover_image_url || media.find(m => m.type === 'image')?.src || FALLBACK_IMAGE;
  const dateLabel = a.event_date
    ? new Date(a.event_date).toLocaleDateString('fr-FR', {day: '2-digit', month: 'long', year: 'numeric'})
    : 'Date à venir';
  const galleryMedia = media.map((m, i) => ({id: `${a.id}-${i}`, src: m.src, type: m.type, alt: `${a.title} — média ${i + 1}`}));

  return (
    <main>
      <section className="section detail-hero">
        <div className="container">
          <Link className="back" href="/nos-activites"><ArrowLeft size={15} /> Retour aux activités</Link>
          <div className="eyebrow">{a.status === 'past' ? 'ARCHIVES' : 'ANNONCE'}</div>
          <h1 className="title">{a.title}</h1>
          <div className="detail-meta">
            <span><CalendarDays size={16} />{dateLabel}</span>
            <span><MapPin size={16} />{a.location || 'Lieu à venir'}</span>
            {a.status === 'announced' && <span><Sparkles size={16} />À venir</span>}
          </div>
          <div className="detail-grid">
            <div>
              <p className="rich">{a.description}</p>
              {a.detailed_description && <p className="rich" style={{marginTop: 14}}>{a.detailed_description}</p>}
              {a.status === 'announced' && !a.event_date && !a.location && (
                <p className="muted">Les informations de date et de lieu seront publiées ultérieurement.</p>
              )}
            </div>
            <div className="detail-image"><ClickableMedia src={cover} alt={a.title} width={900} height={650} /></div>
          </div>
          {media.length > 1 && <div style={{marginTop: 40}}><GalleryView media={galleryMedia} /></div>}
        </div>
      </section>
    </main>
  );
}
