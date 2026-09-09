'use client';
import Link from 'next/link';
import {useMemo, useState, useTransition} from 'react';
import {Search, Trash2, Pencil, Eye, EyeOff} from 'lucide-react';
import {deleteNewsAction, toggleNewsStatusAction} from '@/app/admin/actualites/actions';

export type NewsListRow = {
  id: string;
  title: string;
  status: string;
  event_date: string | null;
  created_at: string;
};

export function NewsTable({items}: {items: NewsListRow[]}) {
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState(items);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(n => n.title.toLowerCase().includes(q));
  }, [rows, query]);

  function handleDelete(id: string) {
    if (!confirm('Supprimer définitivement cette actualité ?')) return;
    startTransition(async () => {
      const res = await deleteNewsAction(id);
      if (res.ok) setRows(prev => prev.filter(n => n.id !== id));
      else alert(`Suppression impossible : ${res.message}`);
    });
  }

  function handleToggle(id: string, status: string) {
    startTransition(async () => {
      const res = await toggleNewsStatusAction(id, status);
      if (res.ok) setRows(prev => prev.map(n => n.id === id ? {...n, status: status === 'published' ? 'draft' : 'published'} : n));
      else alert(`Action impossible : ${res.message}`);
    });
  }

  return (
    <div>
      <div className="filterbar admin-filterbar">
        <label className="search">
          <Search size={16} />
          <input placeholder="Rechercher une actualité" value={query} onChange={e => setQuery(e.target.value)} />
        </label>
        <Link href="/admin/actualites/nouveau" className="btn gold">Nouvelle actualité</Link>
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state"><Search /><div><h2>Aucune actualité</h2><p className="muted">{rows.length === 0 ? 'Rien de publié pour l’instant — crée la première actualité.' : 'Aucun résultat pour cette recherche.'}</p></div></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Titre</th><th>Statut</th><th>Date</th><th /></tr></thead>
            <tbody>
              {filtered.map(n => (
                <tr key={n.id} className="admin-table-row">
                  <td>{n.title}</td>
                  <td><span className={`admin-badge ${n.status === 'published' ? 'admin-badge-live' : ''}`}>{n.status === 'published' ? 'Publié' : 'Brouillon'}</span></td>
                  <td>{n.event_date ? new Date(n.event_date).toLocaleDateString('fr-FR') : '—'}</td>
                  <td className="admin-table-actions">
                    <button aria-label={n.status === 'published' ? 'Dépublier' : 'Publier'} onClick={() => handleToggle(n.id, n.status)} disabled={pending}>
                      {n.status === 'published' ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <Link href={`/admin/actualites/${n.id}`} aria-label="Modifier"><Pencil size={15} /></Link>
                    <button aria-label="Supprimer" onClick={() => handleDelete(n.id)} disabled={pending}><Trash2 size={15} /></button>
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
