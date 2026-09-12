import {notFound} from 'next/navigation';
import {createClient} from '@/lib/supabase/server';
import {NewsForm, type NewsRow} from '@/components/admin/news-form';
import {MediaGalleryManager, type GalleryItem} from '@/components/admin/media-gallery-manager';
import {updateNewsAction} from '../actions';
import {addNewsMediaAction, deleteNewsMediaAction} from '../media-actions';

export const dynamic = 'force-dynamic';

export default async function EditNewsPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const supabase = await createClient();
  const {data} = await supabase.from('news').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();

  const news = data as NewsRow;

  const {data: mediaRows} = await supabase
    .from('news_media')
    .select('id, media_url, media_type')
    .eq('news_id', id)
    .order('display_order', {ascending: true});
  const media: GalleryItem[] = (mediaRows ?? []).map(m => ({id: m.id, url: m.media_url, type: m.media_type as 'image' | 'video'}));

  return (
    <div>
      <NewsForm news={news} action={updateNewsAction.bind(null, news.id)} />
      <div className="admin-form" style={{marginTop: 40}}>
        <h2 className="admin-title" style={{fontSize: '1.2rem'}}>Galerie de l’actualité</h2>
        <p className="muted" style={{marginTop: -8}}>Photos/vidéos supplémentaires affichées sous le contenu de l’actualité sur le site public.</p>
        <MediaGalleryManager items={media} addAction={addNewsMediaAction.bind(null, id)} deleteAction={deleteNewsMediaAction} />
      </div>
    </div>
  );
}
