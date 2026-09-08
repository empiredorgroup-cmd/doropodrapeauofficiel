'use server';
import {revalidatePath} from 'next/cache';
import {createClient} from '@/lib/supabase/server';

export async function deleteVisitorAction(id: string) {
  const supabase = await createClient();
  const {error} = await supabase.from('visitors').delete().eq('id', id);
  if (error) return {ok: false as const, message: error.message};
  revalidatePath('/admin/visiteurs');
  return {ok: true as const};
}
