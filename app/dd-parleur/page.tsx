import type {Metadata} from 'next';
import {Newspaper, Info, CalendarDays, MapPin, Facebook, FileText} from 'lucide-react';
import {createClient} from '@/lib/supabase/server';
import {ClickableMedia} from '@/components/lightbox';
import type {NewsRow} from '@/components/admin/news-form';

export const metadata: Metadata = {title: 'Le DD parleur', description: 'Actualités et publications de DOROPO DRAPEAU.'};
export const dynamic = 'force-dynamic';

export default async function DdParleurPage() {
  const supabase = await createClient();
  const {data} = await supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .order('event_date', {ascending: false, nullsFirst: false})
    .order('created_at', {ascending: false});

  const news = (data ?? []) as NewsRow[];

  return (
    <main>
      <section className="section page-hero">
        <div className="container">
          <div className="eyebrow">Actualités</div>
          <h1 className="title">Le DD parleur</h1>
          <p className="lead">L’espace éditorial de DOROPO DRAPEAU pour les actualités, communiqués, annonces et publications de l’association.</p>

          {news.length === 0 ? (
            <div className="card news-empty">
              <Newspaper size={30} />
              <div>
                <h2>Publications à venir</h2>
                <p className="muted">Aucune actualité publiée pour l’instant — revenez bientôt.</p>
              </div>
              <Info size={20} />
            </div>
          ) : (
            <div className="news-feed">
              {news.map(n => (
                <article className="card news-post" key={n.id}>
                  {n.image_url && (
                    <div className="news-post-media">
                      <ClickableMedia src={n.image_url} alt={n.title} width={800} height={520} />
                    </div>
                  )}
                  {n.video_url && (
                    <div className="news-post-media">
                      <video src={n.video_url} controls preload="metadata" style={{width: '100%', display: 'block'}} />
                    </div>
                  )}
                  <div className="news-post-body">
                    <h2>{n.title}</h2>
                    {(n.event_date || n.location) && (
                      <div className="news-post-meta">
                        {n.event_date && <span><CalendarDays size={14} /> {new Date(n.event_date).toLocaleDateString('fr-FR')}{n.event_time ? ` · ${n.event_time.slice(0, 5)}` : ''}</span>}
                        {n.location && <span><MapPin size={14} /> {n.location}</span>}
                      </div>
                    )}
                    {n.content && <p className="rich">{n.content}</p>}
                    {n.caption && <p className="muted news-post-caption">{n.caption}</p>}
                    <div className="news-post-links">
                      {n.document_url && <a href={n.document_url} target="_blank" rel="noreferrer" className="text-link"><FileText size={15} /> Voir le document</a>}
                      {n.facebook_link && <a href={n.facebook_link} target="_blank" rel="noreferrer" className="text-link"><Facebook size={15} /> Voir sur Facebook</a>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
