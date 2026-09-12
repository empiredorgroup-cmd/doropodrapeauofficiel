'use server';
import {randomUUID} from 'node:crypto';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {createClient} from '@/lib/supabase/server';

type ActionResult = {ok: true} | {ok: false; message: string};
type SupaClient = Awaited<ReturnType<typeof createClient>>;

function slugify(s: string): string {
  return s.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function uploadIfProvided(supabase: SupaClient, file: File | null, fallbackUrl: string): Promise<{url: string | null; error?: string}> {
  if (!file || file.size === 0) return {url: fallbackUrl || null};
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `activites/${randomUUID()}-${safeName}`;
  const {error} = await supabase.storage.from('site-media').upload(path, file, {upsert: false});
  if (error) return {url: fallbackUrl || null, error: error.message};
  const {data} = supabase.storage.from('site-media').getPublicUrl(path);
  return {url: data.publicUrl};
}

function readActivityFields(formData: FormData) {
  return {
    title: String(formData.get('title') || '').trim(),
    description: String(formData.get('description') || '').trim() || null,
    detailed_description: String(formData.get('detailed_description') || '').trim() || null,
    event_date: String(formData.get('event_date') || '') || null,
    event_time: String(formData.get('event_time') || '') || null,
    location: String(formData.get('location') || '').trim() || null,
    status: formData.get('status') === 'announced' ? 'announced' : 'past',
    display_order: Number(formData.get('display_order') || 0) || 0,
  };
}

export async function createActivityAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const fields = readActivityFields(formData);
  if (!fields.title) throw new Error('Le titre est obligatoire.');

  const slugInput = String(formData.get('slug') || '').trim();
  const slug = slugify(slugInput || fields.title);

  const cover = await uploadIfProvided(supabase, formData.get('cover_image') as File | null, '');

  const {error} = await supabase.from('activities').insert({...fields, slug, cover_image_url: cover.url});
  if (error) throw new Error(error.message);

  revalidatePath('/admin/activites');
  revalidatePath('/nos-activites');
  redirect('/admin/activites/');
}

export async function updateActivityAction(id: string, formData: FormData): Promise<void> {
  const supabase = await createClient();
  const fields = readActivityFields(formData);
  if (!fields.title) throw new Error('Le titre est obligatoire.');

  const cover = await uploadIfProvided(supabase, formData.get('cover_image') as File | null, String(formData.get('current_cover_url') || ''));

  const {error} = await supabase.from('activities').update({
    ...fields,
    cover_image_url: cover.url,
    updated_at: new Date().toISOString(),
  }).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/activites');
  revalidatePath('/nos-activites');
  redirect('/admin/activites/');
}

export async function deleteActivityAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {error} = await supabase.from('activities').delete().eq('id', id);
  if (error) return {ok: false, message: error.message};
  revalidatePath('/admin/activites');
  revalidatePath('/nos-activites');
  return {ok: true};
}
