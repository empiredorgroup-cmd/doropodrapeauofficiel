import {notFound} from 'next/navigation';
import {createClient} from '@/lib/supabase/server';
import {MemberForm, type MemberRow} from '@/components/admin/member-form';
import {updateMemberAction} from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditMemberPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const supabase = await createClient();
  const {data} = await supabase.from('members').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();

  const member = data as MemberRow;
  return <MemberForm member={member} action={updateMemberAction.bind(null, member.id)} />;
}
