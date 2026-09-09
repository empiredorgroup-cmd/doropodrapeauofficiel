import type {Metadata} from 'next';
import {createClient} from '@/lib/supabase/server';
import {NewsTable, type NewsListRow} from '@/components/admin/news-table';

export const metadata: Metadata = {title: 'Actualités'};
export const dynamic = 'force-dynamic';

export default async function AdminNewsListPage() {
  const supabase = await createClient();
  const {data} = await supabase
    .from('news')
    .select('id, title, status, event_date, created_at')
    .order('created_at', {ascending: false});

  const items = (data ?? []) as NewsListRow[];

  return (
    <div>
      <div className="eyebrow">DOROPO DRAPEAU · ADMIN</div>
      <h1 className="admin-title">Actualités / DD Parleur ({items.length})</h1>
      <NewsTable items={items} />
    </div>
  );
}
