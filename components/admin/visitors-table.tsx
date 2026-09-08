'use client';
import {Fragment, useMemo, useState, useTransition} from 'react';
import {Search, ChevronDown, Trash2, ArrowUpDown} from 'lucide-react';
import {deleteVisitorAction} from '@/app/admin/visiteurs/actions';

export type VisitorRow = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  place: string | null;
  visit_date: string;
  visit_time: string;
  created_at: string;
};

export function VisitorsTable({visitors}: {visitors: VisitorRow[]}) {
  const [query, setQuery] = useState('');
  const [sortAsc, setSortAsc] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [rows, setRows] = useState(visitors);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows;
    if (q) {
      list = list.filter(v =>
        `${v.first_name} ${v.last_name} ${v.phone} ${v.email ?? ''}`.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) =>
      sortAsc ? a.created_at.localeCompare(b.created_at) : b.created_at.localeCompare(a.created_at)
    );
  }, [rows, query, sortAsc]);

  function handleDelete(id: string) {
    if (!confirm('Supprimer définitivement cet enregistrement de visiteur ?')) return;
    startTransition(async () => {
      const res = await deleteVisitorAction(id);
      if (res.ok) setRows(prev => prev.filter(v => v.id !== id));
      else alert(`Suppression impossible : ${res.message}`);
    });
  }

  return (
    <div>
      <div className="filterbar admin-filterbar">
        <label className="search">
          <Search size={16} />
          <input placeholder="Rechercher un visiteur (nom, téléphone, email)" value={query} onChange={e => setQuery(e.target.value)} />
        </label>
        <button className="admin-sort-btn" onClick={() => setSortAsc(v => !v)}>
          <ArrowUpDown size={15} /> {sortAsc ? 'Plus anciens d’abord' : 'Plus récents d’abord'}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state"><Search /><div><h2>Aucun visiteur</h2><p className="muted">{rows.length === 0 ? 'Personne ne s’est encore enregistré via le formulaire du site.' : 'Aucun résultat pour cette recherche.'}</p></div></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Nom complet</th><th>Téléphone</th><th>Email</th><th>Inscrit le</th><th /></tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <Fragment key={v.id}>
                  <tr className="admin-table-row" onClick={() => setOpenId(openId === v.id ? null : v.id)}>
                    <td>{v.first_name} {v.last_name}</td>
                    <td>{v.phone}</td>
                    <td>{v.email || '—'}</td>
                    <td>{new Date(v.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="admin-table-actions">
                      <ChevronDown size={16} style={{transform: openId === v.id ? 'rotate(180deg)' : undefined}} />
                      <button
                        aria-label="Supprimer"
                        onClick={e => {e.stopPropagation(); handleDelete(v.id);}}
                        disabled={pending}
                      ><Trash2 size={15} /></button>
                    </td>
                  </tr>
                  {openId === v.id && (
                    <tr className="admin-table-detail"><td colSpan={5}>
                      <div className="admin-detail-grid">
                        <div><span>Date de visite</span><strong>{v.visit_date}</strong></div>
                        <div><span>Heure</span><strong>{v.visit_time}</strong></div>
                        <div><span>Lieu renseigné</span><strong>{v.place || '—'}</strong></div>
                        <div><span>Identifiant</span><strong>{v.id}</strong></div>
                      </div>
                    </td></tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
