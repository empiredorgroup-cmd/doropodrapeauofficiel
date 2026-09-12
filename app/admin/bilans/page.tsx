import type {Metadata} from 'next';
import {createClient} from '@/lib/supabase/server';
import {ReportTable, type ReportListRow} from '@/components/admin/report-table';

export const metadata: Metadata = {title: 'Bilans annuels'};
export const dynamic = 'force-dynamic';

export default async function AdminReportsPage() {
  const supabase = await createClient();
  const {data} = await supabase
    .from('annual_reports')
    .select('id, year, title, is_published')
    .order('year', {ascending: false});

  const items = (data ?? []) as ReportListRow[];

  return (
    <div>
      <div className="eyebrow">DOROPO DRAPEAU · ADMIN</div>
      <h1 className="admin-title">Bilans annuels ({items.length})</h1>
      <ReportTable items={items} />
    </div>
  );
}
