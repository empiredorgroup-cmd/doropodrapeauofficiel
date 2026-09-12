import type {Metadata} from 'next';
import {createClient} from '@/lib/supabase/server';
import {ActivityTable, type ActivityListRow} from '@/components/admin/activity-table';

export const metadata: Metadata = {title: 'Activités'};
export const dynamic = 'force-dynamic';

export default async function AdminActivitiesPage() {
  const supabase = await createClient();
  const {data} = await supabase
    .from('activities')
    .select('id, title, status, event_date, display_order')
    .order('display_order', {ascending: true});

  const items = (data ?? []) as ActivityListRow[];

  return (
    <div>
      <div className="eyebrow">DOROPO DRAPEAU · ADMIN</div>
      <h1 className="admin-title">Activités ({items.length})</h1>
      <ActivityTable items={items} />
    </div>
  );
}
