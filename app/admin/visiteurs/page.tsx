import {createClient} from '@/lib/supabase/server';
import {VisitorsTable, type VisitorRow} from '@/components/admin/visitors-table';

export const dynamic = 'force-dynamic';

export default async function AdminVisitorsPage() {
  const supabase = await createClient();
  const {data} = await supabase
    .from('visitors')
    .select('id, first_name, last_name, phone, email, place, visit_date, visit_time, created_at')
    .order('created_at', {ascending: false});

  const visitors = (data ?? []) as VisitorRow[];

  return (
    <div>
      <div className="eyebrow">DOROPO DRAPEAU · ADMIN</div>
      <h1 className="admin-title">Visiteurs ({visitors.length})</h1>
      <VisitorsTable visitors={visitors} />
    </div>
  );
}
