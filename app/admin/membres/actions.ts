'use server';
import {randomUUID} from 'node:crypto';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {createClient} from '@/lib/supabase/server';

type ActionResult = {ok: true} | {ok: false; message: string};
type SupaClient = Awaited<ReturnType<typeof createClient>>;

async function uploadPhotoIfProvided(supabase: SupaClient, file: File | null, fallbackUrl: string): Promise<{url: string | null; error?: string}> {
  if (!file || file.size === 0) return {url: fallbackUrl || null};
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `membres/${randomUUID()}-${safeName}`;
  const {error} = await supabase.storage.from('site-media').upload(path, file, {upsert: false});
  if (error) return {url: fallbackUrl || null, error: error.message};
  const {data} = supabase.storage.from('site-media').getPublicUrl(path);
  return {url: data.publicUrl};
}

function readMemberFields(formData: FormData) {
  return {
    full_name: String(formData.get('full_name') || '').trim(),
    role: String(formData.get('role') || '').trim(),
    description: String(formData.get('description') || '').trim() || null,
    display_order: Number(formData.get('display_order') || 0) || 0,
    is_active: formData.get('is_active') === 'on',
  };
}

export async function createMemberAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const fields = readMemberFields(formData);
  if (!fields.full_name || !fields.role) throw new Error('Le nom et la fonction sont obligatoires.');

  const photo = await uploadPhotoIfProvided(supabase, formData.get('photo') as File | null, '');

  const {error} = await supabase.from('members').insert({...fields, photo_url: photo.url});
  if (error) throw new Error(error.message);

  revalidatePath('/admin/membres');
  revalidatePath('/nos-membres');
  redirect('/admin/membres/');
}

export async function updateMemberAction(id: string, formData: FormData): Promise<void> {
  const supabase = await createClient();
  const fields = readMemberFields(formData);
  if (!fields.full_name || !fields.role) throw new Error('Le nom et la fonction sont obligatoires.');

  const photo = await uploadPhotoIfProvided(supabase, formData.get('photo') as File | null, String(formData.get('current_photo_url') || ''));

  const {error} = await supabase.from('members').update({
    ...fields,
    photo_url: photo.url,
    updated_at: new Date().toISOString(),
  }).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/membres');
  revalidatePath('/nos-membres');
  redirect('/admin/membres/');
}

export async function deleteMemberAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {error} = await supabase.from('members').delete().eq('id', id);
  if (error) return {ok: false, message: error.message};
  revalidatePath('/admin/membres');
  revalidatePath('/nos-membres');
  return {ok: true};
}

export async function toggleMemberActiveAction(id: string, currentlyActive: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const {error} = await supabase.from('members').update({is_active: !currentlyActive}).eq('id', id);
  if (error) return {ok: false, message: error.message};
  revalidatePath('/admin/membres');
  revalidatePath('/nos-membres');
  return {ok: true};
}
