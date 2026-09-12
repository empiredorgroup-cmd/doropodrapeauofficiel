import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';

export type PartnerRow = {
  id: string;
  name: string;
  description: string | null;
  responsible_name: string | null;
  logo_url: string | null;
  website_url: string | null;
  display_order: number;
  is_active: boolean;
};

export function PartnerForm({partner, action}: {partner?: PartnerRow; action: (formData: FormData) => void}) {
  return (
    <form action={action} className="admin-form">
      <Link className="back" href="/admin/partenaires"><ArrowLeft size={15} /> Retour aux partenaires</Link>
      <h1 className="admin-title">{partner ? 'Modifier le partenaire' : 'Nouveau partenaire'}</h1>

      <label>
        <span>Nom *</span>
        <input type="text" name="name" required defaultValue={partner?.name} />
      </label>

      <label>
        <span>Description</span>
        <textarea name="description" rows={3} defaultValue={partner?.description ?? ''} />
      </label>

      <label>
        <span>Responsable</span>
        <input type="text" name="responsible_name" defaultValue={partner?.responsible_name ?? ''} />
      </label>

      <label>
        <span>Site web / lien (facultatif)</span>
        <input type="url" name="website_url" placeholder="https://..." defaultValue={partner?.website_url ?? ''} />
      </label>

      <div className="admin-form-row">
        <label>
          <span>Logo / visuel {partner?.logo_url && '(déjà en place — laisse vide pour la garder)'}</span>
          <input type="file" name="logo" accept="image/*" />
        </label>
        <label>
          <span>Ordre d’affichage</span>
          <input type="number" name="display_order" defaultValue={partner?.display_order ?? 0} />
        </label>
      </div>
      {partner && <input type="hidden" name="current_logo_url" value={partner.logo_url ?? ''} />}

      <label className="admin-checkbox">
        <input type="checkbox" name="is_active" defaultChecked={partner?.is_active ?? true} />
        <span>Afficher ce partenaire sur le site public</span>
      </label>

      <button type="submit" className="btn gold">{partner ? 'Enregistrer les modifications' : 'Créer le partenaire'}</button>
    </form>
  );
}
