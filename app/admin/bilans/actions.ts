'use server';
import {randomUUID} from 'node:crypto';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {createClient} from '@/lib/supabase/server';

type ActionResult = {ok: true} | {ok: false; message: string};
type SupaClient = Awaited<ReturnType<typeof createClient>>;

async function uploadPdfIfProvided(supabase: SupaClient, file: File | null, fallbackUrl: string): Promise<{url: string | null; error?: string}> {
  if (!file || file.size === 0) return {url: fallbackUrl || null};
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `bilans/${randomUUID()}-${safeName}`;
  const {error} = await supabase.storage.from('site-media').upload(path, file, {upsert: false, contentType: 'application/pdf'});
  if (error) return {url: fallbackUrl || null, error: error.message};
  const {data} = supabase.storage.from('site-media').getPublicUrl(path);
  return {url: data.publicUrl};
}

function readReportFields(formData: FormData) {
  return {
    year: Number(formData.get('year') || new Date().getFullYear()),
    title: String(formData.get('title') || '').trim(),
    description: String(formData.get('description') || '').trim() || null,
    is_published: formData.get('is_published') === 'on',
  };
}

export async function createReportAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const fields = readReportFields(formData);
  if (!fields.title) throw new Error('Le titre est obligatoire.');

  const pdf = await uploadPdfIfProvided(supabase, formData.get('pdf') as File | null, '');
  if (!pdf.url) throw new Error('Le fichier PDF est obligatoire.');

  const {error} = await supabase.from('annual_reports').insert({...fields, pdf_url: pdf.url});
  if (error) throw new Error(error.message);

  revalidatePath('/admin/bilans');
  revalidatePath('/bilans');
  redirect('/admin/bilans/');
}

export async function updateReportAction(id: string, formData: FormData): Promise<void> {
  const supabase = await createClient();
  const fields = readReportFields(formData);
  if (!fields.title) throw new Error('Le titre est obligatoire.');

  const pdf = await uploadPdfIfProvided(supabase, formData.get('pdf') as File | null, String(formData.get('current_pdf_url') || ''));
  if (!pdf.url) throw new Error('Le fichier PDF est obligatoire.');

  const {error} = await supabase.from('annual_reports').update({...fields, pdf_url: pdf.url}).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/bilans');
  revalidatePath('/bilans');
  redirect('/admin/bilans/');
}

export async function deleteReportAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {error} = await supabase.from('annual_reports').delete().eq('id', id);
  if (error) return {ok: false, message: error.message};
  revalidatePath('/admin/bilans');
  revalidatePath('/bilans');
  return {ok: true};
}

export async function toggleReportPublishedAction(id: string, currentlyPublished: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const {error} = await supabase.from('annual_reports').update({is_published: !currentlyPublished}).eq('id', id);
  if (error) return {ok: false, message: error.message};
  revalidatePath('/admin/bilans');
  revalidatePath('/bilans');
  return {ok: true};
}
