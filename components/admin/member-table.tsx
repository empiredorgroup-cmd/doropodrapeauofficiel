'use client';
import Link from 'next/link';
import {useMemo, useState, useTransition} from 'react';
import {Search, Trash2, Pencil, Eye, EyeOff} from 'lucide-react';
import {deleteMemberAction, toggleMemberActiveAction} from '@/app/admin/membres/actions';

export type MemberListRow = {
  id: string;
  full_name: string;
  role: string;
  is_active: boolean;
  display_order: number;
};

export function MemberTable({items}: {items: MemberListRow[]}) {
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState(items);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? rows.filter(m => `${m.full_name} ${m.role}`.toLowerCase().includes(q)) : rows;
    return [...list].sort((a, b) => a.display_order - b.display_order);
  }, [rows, query]);

  function handleDelete(id: string) {
    if (!confirm('Supprimer définitivement ce membre ?')) return;
    startTransition(async () => {
      const res = await deleteMemberAction(id);
      if (res.ok) setRows(prev => prev.filter(m => m.id !== id));
      else alert(`Suppression impossible : ${res.message}`);
    });
  }

  function handleToggle(id: string, active: boolean) {
    startTransition(async () => {
      const res = await toggleMemberActiveAction(id, active);
      if (res.ok) setRows(prev => prev.map(m => m.id === id ? {...m, is_active: !active} : m));
      else alert(`Action impossible : ${res.message}`);
    });
  }

  return (
    <div>
      <div className="filterbar admin-filterbar">
        <label className="search">
          <Search size={16} />
          <input placeholder="Rechercher un membre (nom, fonction)" value={query} onChange={e => setQuery(e.target.value)} />
        </label>
        <Link href="/admin/membres/nouveau" className="btn gold">Nouveau membre</Link>
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state"><Search /><div><h2>Aucun membre</h2><p className="muted">{rows.length === 0 ? 'Ajoute le premier membre.' : 'Aucun résultat pour cette recherche.'}</p></div></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Nom</th><th>Fonction</th><th>Visible</th><th /></tr></thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className="admin-table-row">
                  <td>{m.full_name}</td>
                  <td>{m.role}</td>
                  <td><span className={`admin-badge ${m.is_active ? 'admin-badge-live' : ''}`}>{m.is_active ? 'Visible' : 'Masqué'}</span></td>
                  <td className="admin-table-actions">
                    <button aria-label={m.is_active ? 'Masquer' : 'Afficher'} onClick={() => handleToggle(m.id, m.is_active)} disabled={pending}>
                      {m.is_active ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <Link href={`/admin/membres/${m.id}`} aria-label="Modifier"><Pencil size={15} /></Link>
                    <button aria-label="Supprimer" onClick={() => handleDelete(m.id)} disabled={pending}><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
