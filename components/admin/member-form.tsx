import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';

export type MemberRow = {
  id: string;
  full_name: string;
  role: string;
  description: string | null;
  photo_url: string | null;
  display_order: number;
  is_active: boolean;
};

export function MemberForm({member, action}: {member?: MemberRow; action: (formData: FormData) => void}) {
  return (
    <form action={action} className="admin-form">
      <Link className="back" href="/admin/membres"><ArrowLeft size={15} /> Retour aux membres</Link>
      <h1 className="admin-title">{member ? 'Modifier le membre' : 'Nouveau membre'}</h1>

      <label>
        <span>Nom complet *</span>
        <input type="text" name="full_name" required defaultValue={member?.full_name} />
      </label>

      <label>
        <span>Fonction *</span>
        <input type="text" name="role" required defaultValue={member?.role} placeholder="ex. Président Fondateur" />
      </label>

      <label>
        <span>Description</span>
        <textarea name="description" rows={3} defaultValue={member?.description ?? ''} />
      </label>

      <div className="admin-form-row">
        <label>
          <span>Photo {member?.photo_url && '(déjà en place — laisse vide pour la garder)'}</span>
          <input type="file" name="photo" accept="image/*" />
        </label>
        <label>
          <span>Ordre d’affichage</span>
          <input type="number" name="display_order" defaultValue={member?.display_order ?? 0} />
        </label>
      </div>
      {member && <input type="hidden" name="current_photo_url" value={member.photo_url ?? ''} />}

      <label className="admin-checkbox">
        <input type="checkbox" name="is_active" defaultChecked={member?.is_active ?? true} />
        <span>Afficher ce membre sur le site public</span>
      </label>

      <button type="submit" className="btn gold">{member ? 'Enregistrer les modifications' : 'Créer le membre'}</button>
    </form>
  );
}
