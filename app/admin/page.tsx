import {Users, Newspaper, CalendarDays, UserSquare2, Handshake, FileText} from 'lucide-react';
import {createClient} from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

async function count(supabase: Awaited<ReturnType<typeof createClient>>, table: string) {
  const {count} = await supabase.from(table).select('*', {count: 'exact', head: true});
  return count ?? 0;
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const [visitors, news, activities, members, partners, reports] = await Promise.all([
    count(supabase, 'visitors'),
    count(supabase, 'news'),
    count(supabase, 'activities'),
    count(supabase, 'members'),
    count(supabase, 'partners'),
    count(supabase, 'annual_reports'),
  ]);

  const stats = [
    ['Visiteurs enregistrés', visitors, Users],
    ['Actualités', news, Newspaper],
    ['Activités', activities, CalendarDays],
    ['Membres', members, UserSquare2],
    ['Partenaires', partners, Handshake],
    ['Bilans annuels', reports, FileText],
  ] as const;

  return (
    <div>
      <div className="eyebrow">DOROPO DRAPEAU · ADMIN</div>
      <h1 className="admin-title">Tableau de bord</h1>
      <div className="grid cards-3 admin-stats">
        {stats.map(([label, value, Icon]) => (
          <div className="card admin-stat-card" key={label}>
            <Icon size={22} />
            <div>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="muted admin-dashboard-note">
        Les écrans de gestion (créer/modifier/supprimer) pour chaque section arrivent dans les
        prochaines phases. Ce tableau de bord lit déjà les vraies données de la base Supabase.
      </p>
    </div>
  );
}
