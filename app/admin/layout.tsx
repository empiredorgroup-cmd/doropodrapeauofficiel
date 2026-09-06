import type {ReactNode} from 'react';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {LayoutDashboard, Users, Newspaper, CalendarDays, UserSquare2, Handshake, FileText, Images, Settings, LogOut} from 'lucide-react';
import {createClient} from '@/lib/supabase/server';
import {signOutAction} from './actions';

const navItems = [
  ['Tableau de bord', '/admin', LayoutDashboard],
  ['Visiteurs', '/admin/visiteurs', Users],
  ['Actualités / DD Parleur', '/admin/actualites', Newspaper],
  ['Activités', '/admin/activites', CalendarDays],
  ['Membres', '/admin/membres', UserSquare2],
  ['Partenaires', '/admin/partenaires', Handshake],
  ['Bilans annuels', '/admin/bilans', FileText],
  ['Galerie / Médias', '/admin/galerie', Images],
  ['Paramètres', '/admin/parametres', Settings],
] as const;

export default async function AdminLayout({children}: {children: ReactNode}) {
  const supabase = await createClient();
  const {data: {user}} = await supabase.auth.getUser();

  // Page de connexion : pas de vérification admin (le middleware gère déjà la redirection si déjà connecté).
  if (!user) {
    // Le middleware redirige déjà normalement ; ce filet de sécurité ne devrait jamais se déclencher
    // pour /admin/login (exclu par le middleware), donc s'il n'y a pas d'utilisateur ici, on renvoie
    // simplement les enfants (= la page de connexion elle-même).
    return <>{children}</>;
  }

  const {data: adminRow} = await supabase.from('admins').select('user_id').eq('user_id', user.id).maybeSingle();
  if (!adminRow) {
    // Utilisateur authentifié mais pas administrateur : jamais d'accès au dashboard.
    await supabase.auth.signOut();
    redirect('/admin/login');
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <img src="/images/Logo 1.jpeg" alt="DOROPO DRAPEAU" width={36} height={36} />
          <span>Administration</span>
        </div>
        <nav>
          {navItems.map(([label, href, Icon]) => (
            <Link key={href} href={href}><Icon size={17} /> {label}</Link>
          ))}
        </nav>
        <form action={signOutAction}>
          <button type="submit" className="admin-logout"><LogOut size={16} /> Déconnexion</button>
        </form>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
