import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';

export type ReportRow = {
  id: string;
  year: number;
  title: string;
  description: string | null;
  pdf_url: string;
  is_published: boolean;
};

export function ReportForm({report, action}: {report?: ReportRow; action: (formData: FormData) => void}) {
  return (
    <form action={action} className="admin-form">
      <Link className="back" href="/admin/bilans"><ArrowLeft size={15} /> Retour aux bilans</Link>
      <h1 className="admin-title">{report ? 'Modifier le bilan' : 'Nouveau bilan annuel'}</h1>

      <div className="admin-form-row">
        <label>
          <span>Année *</span>
          <input type="number" name="year" required defaultValue={report?.year ?? new Date().getFullYear()} />
        </label>
        <label>
          <span>Titre *</span>
          <input type="text" name="title" required defaultValue={report?.title} placeholder="ex. Bilan annuel 2025" />
        </label>
      </div>

      <label>
        <span>Description (facultatif)</span>
        <textarea name="description" rows={4} defaultValue={report?.description ?? ''} />
      </label>

      <label>
        <span>Fichier PDF {report?.pdf_url ? '(déjà en place — laisse vide pour le garder)' : '*'}</span>
        <input type="file" name="pdf" accept="application/pdf" required={!report} />
      </label>
      {report && <input type="hidden" name="current_pdf_url" value={report.pdf_url} />}

      <label className="admin-checkbox">
        <input type="checkbox" name="is_published" defaultChecked={report?.is_published ?? true} />
        <span>Publier ce bilan sur le site public</span>
      </label>

      <button type="submit" className="btn gold">{report ? 'Enregistrer les modifications' : 'Créer le bilan'}</button>
    </form>
  );
}
