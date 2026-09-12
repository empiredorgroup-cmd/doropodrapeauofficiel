import type {Metadata} from 'next';
import {FileText, Download} from 'lucide-react';
import {createClient} from '@/lib/supabase/server';

export const metadata: Metadata = {title: 'Nos bilans annuels', description: 'Bilans annuels de DOROPO DRAPEAU au format PDF.'};
export const dynamic = 'force-dynamic';

type ReportRow = {id: string; year: number; title: string; description: string | null; pdf_url: string};

export default async function Page() {
  const supabase = await createClient();
  const {data} = await supabase
    .from('annual_reports')
    .select('id, year, title, description, pdf_url')
    .eq('is_published', true)
    .order('year', {ascending: false});

  const reports = (data ?? []) as ReportRow[];

  return (
    <main>
      <section className="section page-hero">
        <div className="container">
          <div className="eyebrow">Transparence</div>
          <h1 className="title">Nos bilans annuels</h1>
          <p className="lead">Les bilans annuels de l’association, publiés au format PDF.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {reports.length === 0 ? (
            <div className="card empty-state">
              <FileText size={38} />
              <div><h2>Aucun bilan publié</h2><p className="muted">Les documents seront ajoutés prochainement.</p></div>
            </div>
          ) : (
            <div className="report-list">
              {reports.map(r => (
                <a href={r.pdf_url} target="_blank" rel="noreferrer" className="card report-item" key={r.id}>
                  <FileText size={26} />
                  <div className="report-item-body">
                    <span className="eyebrow">{r.year}</span>
                    <h2>{r.title}</h2>
                    {r.description && <p className="muted">{r.description}</p>}
                  </div>
                  <Download size={18} />
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
