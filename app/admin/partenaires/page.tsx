import type {Metadata} from 'next';
import {createClient} from '@/lib/supabase/server';
import {PartnerTable, type PartnerListRow} from '@/components/admin/partner-table';

export const metadata: Metadata = {title: 'Partenaires'};
export const dynamic = 'force-dynamic';

export default async function AdminPartnersPage() {
  const supabase = await createClient();
  const {data} = await supabase
    .from('partners')
    .select('id, name, is_active, display_order')
    .order('display_order', {ascending: true});

  const items = (data ?? []) as PartnerListRow[];

  return (
    <div>
      <div className="eyebrow">DOROPO DRAPEAU · ADMIN</div>
      <h1 className="admin-title">Partenaires ({items.length})</h1>
      <PartnerTable items={items} />
    </div>
  );
}
