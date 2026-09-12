'use client';
import Link from 'next/link';
import {useMemo, useState, useTransition} from 'react';
import {Search, Trash2, Pencil} from 'lucide-react';
import {deleteActivityAction} from '@/app/admin/activites/actions';

export type ActivityListRow = {
  id: string;
  title: string;
  status: string;
  event_date: string | null;
  display_order: number;
};

export function ActivityTable({items}: {items: ActivityListRow[]}) {
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState(items);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? rows.filter(a => a.title.toLowerCase().includes(q)) : rows;
    return [...list].sort((a, b) => a.display_order - b.display_order);
  }, [rows, query]);

  function handleDelete(id: string) {
    if (!confirm('Supprimer définitivement cette activité ?')) return;
    startTransition(async () => {
      const res = await deleteActivityAction(id);
      if (res.ok) setRows(prev => prev.filter(a => a.id !== id));
      else alert(`Suppression impossible : ${res.message}`);
    });
  }

  return (
    <div>
      <div className="filterbar admin-filterbar">
        <label className="search">
          <Search size={16} />
          <input placeholder="Rechercher une activité" value={query} onChange={e => setQuery(e.target.value)} />
        </label>
        <Link href="/admin/activites/nouveau" className="btn gold">Nouvelle activité</Link>
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state"><Search /><div><h2>Aucune activité</h2><p className="muted">{rows.length === 0 ? 'Ajoute la première activité.' : 'Aucun résultat pour cette recherche.'}</p></div></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Titre</th><th>Statut</th><th>Date</th><th /></tr></thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} className="admin-table-row">
                  <td>{a.title}</td>
                  <td><span className={`admin-badge ${a.status === 'announced' ? 'admin-badge-live' : ''}`}>{a.status === 'announced' ? 'À venir' : 'Passée'}</span></td>
                  <td>{a.event_date ? new Date(a.event_date).toLocaleDateString('fr-FR') : '—'}</td>
                  <td className="admin-table-actions">
                    <Link href={`/admin/activites/${a.id}`} aria-label="Modifier"><Pencil size={15} /></Link>
                    <button aria-label="Supprimer" onClick={() => handleDelete(a.id)} disabled={pending}><Trash2 size={15} /></button>
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
