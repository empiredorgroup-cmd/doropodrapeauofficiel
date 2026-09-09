'use server';
import {randomUUID} from 'node:crypto';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {createClient} from '@/lib/supabase/server';

type ActionResult = {ok: true} | {ok: false; message: string};

async function uploadIfProvided(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File | null,
  fallbackUrl: string
): Promise<{url: string | null; error?: string}> {
  if (!file || file.size === 0) return {url: fallbackUrl || null};
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `news/${randomUUID()}-${safeName}`;
  const {error} = await supabase.storage.from('news-media').upload(path, file, {upsert: false});
  if (error) return {url: fallbackUrl || null, error: error.message};
  const {data} = supabase.storage.from('news-media').getPublicUrl(path);
  return {url: data.publicUrl};
}

function readNewsFields(formData: FormData) {
  return {
    title: String(formData.get('title') || '').trim(),
    content: String(formData.get('content') || '').trim() || null,
    event_date: String(formData.get('event_date') || '') || null,
    event_time: String(formData.get('event_time') || '') || null,
    location: String(formData.get('location') || '').trim() || null,
    caption: String(formData.get('caption') || '').trim() || null,
    facebook_link: String(formData.get('facebook_link') || '').trim() || null,
    status: formData.get('status') === 'published' ? 'published' : 'draft',
  };
}

export async function createNewsAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const fields = readNewsFields(formData);
  if (!fields.title) throw new Error('Le titre est obligatoire.');

  const [image, video, doc] = await Promise.all([
    uploadIfProvided(supabase, formData.get('image') as File | null, ''),
    uploadIfProvided(supabase, formData.get('video') as File | null, ''),
    uploadIfProvided(supabase, formData.get('document') as File | null, ''),
  ]);

  const {error} = await supabase.from('news').insert({
    ...fields,
    image_url: image.url,
    video_url: video.url,
    document_url: doc.url,
  });
  if (error) throw new Error(error.message);

  revalidatePath('/admin/actualites');
  revalidatePath('/dd-parleur');
  redirect('/admin/actualites/');
}

export async function updateNewsAction(id: string, formData: FormData): Promise<void> {
  const supabase = await createClient();
  const fields = readNewsFields(formData);
  if (!fields.title) throw new Error('Le titre est obligatoire.');

  const [image, video, doc] = await Promise.all([
    uploadIfProvided(supabase, formData.get('image') as File | null, String(formData.get('current_image_url') || '')),
    uploadIfProvided(supabase, formData.get('video') as File | null, String(formData.get('current_video_url') || '')),
    uploadIfProvided(supabase, formData.get('document') as File | null, String(formData.get('current_document_url') || '')),
  ]);

  const {error} = await supabase.from('news').update({
    ...fields,
    image_url: image.url,
    video_url: video.url,
    document_url: doc.url,
    updated_at: new Date().toISOString(),
  }).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/actualites');
  revalidatePath('/dd-parleur');
  redirect('/admin/actualites/');
}

export async function deleteNewsAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {error} = await supabase.from('news').delete().eq('id', id);
  if (error) return {ok: false, message: error.message};
  revalidatePath('/admin/actualites');
  revalidatePath('/dd-parleur');
  return {ok: true};
}

export async function toggleNewsStatusAction(id: string, currentStatus: string): Promise<ActionResult> {
  const supabase = await createClient();
  const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
  const {error} = await supabase.from('news').update({status: nextStatus}).eq('id', id);
  if (error) return {ok: false, message: error.message};
  revalidatePath('/admin/actualites');
  revalidatePath('/dd-parleur');
  return {ok: true};
}
