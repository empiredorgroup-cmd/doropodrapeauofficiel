import {notFound} from 'next/navigation';
import {createClient} from '@/lib/supabase/server';
import {ActivityForm, type ActivityRow} from '@/components/admin/activity-form';
import {updateActivityAction} from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditActivityPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const supabase = await createClient();
  const {data} = await supabase.from('activities').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();

  const activity = data as ActivityRow;
  return <ActivityForm activity={activity} action={updateActivityAction.bind(null, activity.id)} />;
}
