'use client';
import Link from 'next/link';
import {useMemo, useState, useTransition} from 'react';
import {Search, Trash2, Pencil, Eye, EyeOff} from 'lucide-react';
import {deletePartnerAction, togglePartnerActiveAction} from '@/app/admin/partenaires/actions';

export type PartnerListRow = {
  id: string;
  name: string;
  is_active: boolean;
  display_order: number;
};

export function PartnerTable({items}: {items: PartnerListRow[]}) {
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState(items);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? rows.filter(p => p.name.toLowerCase().includes(q)) : rows;
    return [...list].sort((a, b) => a.display_order - b.display_order);
  }, [rows, query]);

  function handleDelete(id: string) {
    if (!confirm('Supprimer définitivement ce partenaire ?')) return;
    startTransition(async () => {
      const res = await deletePartnerAction(id);
      if (res.ok) setRows(prev => prev.filter(p => p.id !== id));
      else alert(`Suppression impossible : ${res.message}`);
    });
  }

  function handleToggle(id: string, active: boolean) {
    startTransition(async () => {
      const res = await togglePartnerActiveAction(id, active);
      if (res.ok) setRows(prev => prev.map(p => p.id === id ? {...p, is_active: !active} : p));
      else alert(`Action impossible : ${res.message}`);
    });
  }

  return (
    <div>
      <div className="filterbar admin-filterbar">
        <label className="search">
          <Search size={16} />
          <input placeholder="Rechercher un partenaire" value={query} onChange={e => setQuery(e.target.value)} />
        </label>
        <Link href="/admin/partenaires/nouveau" className="btn gold">Nouveau partenaire</Link>
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state"><Search /><div><h2>Aucun partenaire</h2><p className="muted">{rows.length === 0 ? 'Ajoute le premier partenaire.' : 'Aucun résultat pour cette recherche.'}</p></div></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Nom</th><th>Visible</th><th /></tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="admin-table-row">
                  <td>{p.name}</td>
                  <td><span className={`admin-badge ${p.is_active ? 'admin-badge-live' : ''}`}>{p.is_active ? 'Visible' : 'Masqué'}</span></td>
                  <td className="admin-table-actions">
                    <button aria-label={p.is_active ? 'Masquer' : 'Afficher'} onClick={() => handleToggle(p.id, p.is_active)} disabled={pending}>
                      {p.is_active ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <Link href={`/admin/partenaires/${p.id}`} aria-label="Modifier"><Pencil size={15} /></Link>
                    <button aria-label="Supprimer" onClick={() => handleDelete(p.id)} disabled={pending}><Trash2 size={15} /></button>
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
