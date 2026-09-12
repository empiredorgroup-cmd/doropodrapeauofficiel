import type {Metadata} from 'next';
import {createClient} from '@/lib/supabase/server';
import {MemberTable, type MemberListRow} from '@/components/admin/member-table';

export const metadata: Metadata = {title: 'Membres'};
export const dynamic = 'force-dynamic';

export default async function AdminMembersPage() {
  const supabase = await createClient();
  const {data} = await supabase
    .from('members')
    .select('id, full_name, role, is_active, display_order')
    .order('display_order', {ascending: true});

  const items = (data ?? []) as MemberListRow[];

  return (
    <div>
      <div className="eyebrow">DOROPO DRAPEAU · ADMIN</div>
      <h1 className="admin-title">Membres ({items.length})</h1>
      <MemberTable items={items} />
    </div>
  );
}
