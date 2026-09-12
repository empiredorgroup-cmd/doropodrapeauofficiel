import {notFound} from 'next/navigation';
import {createClient} from '@/lib/supabase/server';
import {PartnerForm, type PartnerRow} from '@/components/admin/partner-form';
import {updatePartnerAction} from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditPartnerPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const supabase = await createClient();
  const {data} = await supabase.from('partners').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();

  const partner = data as PartnerRow;
  return <PartnerForm partner={partner} action={updatePartnerAction.bind(null, partner.id)} />;
}
