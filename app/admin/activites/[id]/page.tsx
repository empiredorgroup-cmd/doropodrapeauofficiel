import {notFound} from 'next/navigation';
import {createClient} from '@/lib/supabase/server';
import {ActivityForm, type ActivityRow} from '@/components/admin/activity-form';
import {MediaGalleryManager, type GalleryItem} from '@/components/admin/media-gallery-manager';
import {updateActivityAction} from '../actions';
import {addActivityMediaAction, deleteActivityMediaAction} from '../media-actions';

export const dynamic = 'force-dynamic';

export default async function EditActivityPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const supabase = await createClient();
  const {data} = await supabase.from('activities').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();

  const activity = data as ActivityRow;

  const {data: mediaRows} = await supabase
    .from('activity_media')
    .select('id, media_url, media_type')
    .eq('activity_id', id)
    .order('display_order', {ascending: true});
  const media: GalleryItem[] = (mediaRows ?? []).map(m => ({id: m.id, url: m.media_url, type: m.media_type as 'image' | 'video'}));

  return (
    <div>
      <ActivityForm activity={activity} action={updateActivityAction.bind(null, activity.id)} />
      <div className="admin-form" style={{marginTop: 40}}>
        <h2 className="admin-title" style={{fontSize: '1.2rem'}}>Galerie de l’activité</h2>
        <p className="muted" style={{marginTop: -8}}>Ces photos/vidéos s’affichent sur la page détail de l’activité et dans la galerie générale.</p>
        <MediaGalleryManager items={media} addAction={addActivityMediaAction.bind(null, id)} deleteAction={deleteActivityMediaAction} />
      </div>
    </div>
  );
}
