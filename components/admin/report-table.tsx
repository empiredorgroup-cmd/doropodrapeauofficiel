'use client';
import Link from 'next/link';
import {useMemo, useState, useTransition} from 'react';
import {Search, Trash2, Pencil, Eye, EyeOff} from 'lucide-react';
import {deleteReportAction, toggleReportPublishedAction} from '@/app/admin/bilans/actions';

export type ReportListRow = {
  id: string;
  year: number;
  title: string;
  is_published: boolean;
};

export function ReportTable({items}: {items: ReportListRow[]}) {
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState(items);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? rows.filter(r => `${r.title} ${r.year}`.toLowerCase().includes(q)) : rows;
    return [...list].sort((a, b) => b.year - a.year);
  }, [rows, query]);

  function handleDelete(id: string) {
    if (!confirm('Supprimer définitivement ce bilan ?')) return;
    startTransition(async () => {
      const res = await deleteReportAction(id);
      if (res.ok) setRows(prev => prev.filter(r => r.id !== id));
      else alert(`Suppression impossible : ${res.message}`);
    });
  }

  function handleToggle(id: string, published: boolean) {
    startTransition(async () => {
      const res = await toggleReportPublishedAction(id, published);
      if (res.ok) setRows(prev => prev.map(r => r.id === id ? {...r, is_published: !published} : r));
      else alert(`Action impossible : ${res.message}`);
    });
  }

  return (
    <div>
      <div className="filterbar admin-filterbar">
        <label className="search">
          <Search size={16} />
          <input placeholder="Rechercher un bilan (titre, année)" value={query} onChange={e => setQuery(e.target.value)} />
        </label>
        <Link href="/admin/bilans/nouveau" className="btn gold">Nouveau bilan</Link>
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state"><Search /><div><h2>Aucun bilan</h2><p className="muted">{rows.length === 0 ? 'Ajoute le premier bilan annuel.' : 'Aucun résultat pour cette recherche.'}</p></div></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Année</th><th>Titre</th><th>Statut</th><th /></tr></thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="admin-table-row">
                  <td>{r.year}</td>
                  <td>{r.title}</td>
                  <td><span className={`admin-badge ${r.is_published ? 'admin-badge-live' : ''}`}>{r.is_published ? 'Publié' : 'Brouillon'}</span></td>
                  <td className="admin-table-actions">
                    <button aria-label={r.is_published ? 'Dépublier' : 'Publier'} onClick={() => handleToggle(r.id, r.is_published)} disabled={pending}>
                      {r.is_published ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <Link href={`/admin/bilans/${r.id}`} aria-label="Modifier"><Pencil size={15} /></Link>
                    <button aria-label="Supprimer" onClick={() => handleDelete(r.id)} disabled={pending}><Trash2 size={15} /></button>
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
