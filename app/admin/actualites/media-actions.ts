'use server';
import {randomUUID} from 'node:crypto';
import {revalidatePath} from 'next/cache';
import {createClient} from '@/lib/supabase/server';

type GalleryItem = {id: string; url: string; type: 'image' | 'video'};
type AddResult = {ok: true; items: GalleryItem[]} | {ok: false; message: string};
type DeleteResult = {ok: true} | {ok: false; message: string};

export async function addNewsMediaAction(newsId: string, formData: FormData): Promise<AddResult> {
  const supabase = await createClient();
  const files = formData.getAll('files').filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return {ok: false, message: 'Aucun fichier sélectionné.'};

  const {count} = await supabase.from('news_media').select('*', {count: 'exact', head: true}).eq('news_id', newsId);
  let order = count ?? 0;

  const items: GalleryItem[] = [];
  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const path = `news/${randomUUID()}-${safeName}`;
    const {error: uploadError} = await supabase.storage.from('news-media').upload(path, file, {upsert: false});
    if (uploadError) return {ok: false, message: uploadError.message};
    const {data: pub} = supabase.storage.from('news-media').getPublicUrl(path);
    const media_type: 'image' | 'video' = file.type.startsWith('video/') ? 'video' : 'image';

    const {data: row, error: insertError} = await supabase
      .from('news_media')
      .insert({news_id: newsId, media_url: pub.publicUrl, media_type, display_order: order++})
      .select('id, media_url, media_type')
      .single();
    if (insertError || !row) return {ok: false, message: insertError?.message ?? 'Échec de l’enregistrement.'};
    items.push({id: row.id, url: row.media_url, type: row.media_type as 'image' | 'video'});
  }

  revalidatePath('/admin/actualites');
  revalidatePath('/dd-parleur');
  return {ok: true, items};
}

export async function deleteNewsMediaAction(mediaId: string): Promise<DeleteResult> {
  const supabase = await createClient();
  const {error} = await supabase.from('news_media').delete().eq('id', mediaId);
  if (error) return {ok: false, message: error.message};
  revalidatePath('/admin/actualites');
  revalidatePath('/dd-parleur');
  return {ok: true};
}
