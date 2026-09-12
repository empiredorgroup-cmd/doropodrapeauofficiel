'use server';
import {randomUUID} from 'node:crypto';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {createClient} from '@/lib/supabase/server';

type ActionResult = {ok: true} | {ok: false; message: string};
type SupaClient = Awaited<ReturnType<typeof createClient>>;

async function uploadLogoIfProvided(supabase: SupaClient, file: File | null, fallbackUrl: string): Promise<{url: string | null; error?: string}> {
  if (!file || file.size === 0) return {url: fallbackUrl || null};
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `partenaires/${randomUUID()}-${safeName}`;
  const {error} = await supabase.storage.from('site-media').upload(path, file, {upsert: false});
  if (error) return {url: fallbackUrl || null, error: error.message};
  const {data} = supabase.storage.from('site-media').getPublicUrl(path);
  return {url: data.publicUrl};
}

function readPartnerFields(formData: FormData) {
  return {
    name: String(formData.get('name') || '').trim(),
    description: String(formData.get('description') || '').trim() || null,
    responsible_name: String(formData.get('responsible_name') || '').trim() || null,
    website_url: String(formData.get('website_url') || '').trim() || null,
    display_order: Number(formData.get('display_order') || 0) || 0,
    is_active: formData.get('is_active') === 'on',
  };
}

export async function createPartnerAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const fields = readPartnerFields(formData);
  if (!fields.name) throw new Error('Le nom du partenaire est obligatoire.');

  const logo = await uploadLogoIfProvided(supabase, formData.get('logo') as File | null, '');

  const {error} = await supabase.from('partners').insert({...fields, logo_url: logo.url});
  if (error) throw new Error(error.message);

  revalidatePath('/admin/partenaires');
  revalidatePath('/nos-partenaires');
  redirect('/admin/partenaires/');
}

export async function updatePartnerAction(id: string, formData: FormData): Promise<void> {
  const supabase = await createClient();
  const fields = readPartnerFields(formData);
  if (!fields.name) throw new Error('Le nom du partenaire est obligatoire.');

  const logo = await uploadLogoIfProvided(supabase, formData.get('logo') as File | null, String(formData.get('current_logo_url') || ''));

  const {error} = await supabase.from('partners').update({
    ...fields,
    logo_url: logo.url,
    updated_at: new Date().toISOString(),
  }).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/partenaires');
  revalidatePath('/nos-partenaires');
  redirect('/admin/partenaires/');
}

export async function deletePartnerAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {error} = await supabase.from('partners').delete().eq('id', id);
  if (error) return {ok: false, message: error.message};
  revalidatePath('/admin/partenaires');
  revalidatePath('/nos-partenaires');
  return {ok: true};
}

export async function togglePartnerActiveAction(id: string, currentlyActive: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const {error} = await supabase.from('partners').update({is_active: !currentlyActive}).eq('id', id);
  if (error) return {ok: false, message: error.message};
  revalidatePath('/admin/partenaires');
  revalidatePath('/nos-partenaires');
  return {ok: true};
}
