import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';

export type ActivityRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  detailed_description: string | null;
  event_date: string | null;
  event_time: string | null;
  location: string | null;
  status: string;
  cover_image_url: string | null;
  display_order: number;
};

export function ActivityForm({activity, action}: {activity?: ActivityRow; action: (formData: FormData) => void}) {
  return (
    <form action={action} className="admin-form">
      <Link className="back" href="/admin/activites"><ArrowLeft size={15} /> Retour aux activités</Link>
      <h1 className="admin-title">{activity ? 'Modifier l’activité' : 'Nouvelle activité'}</h1>

      <label>
        <span>Titre *</span>
        <input type="text" name="title" required defaultValue={activity?.title} />
      </label>

      {!activity && (
        <label>
          <span>Identifiant d’URL (facultatif — généré automatiquement à partir du titre si laissé vide)</span>
          <input type="text" name="slug" placeholder="ex. formation-bureau" />
        </label>
      )}

      <label>
        <span>Résumé court</span>
        <textarea name="description" rows={3} defaultValue={activity?.description ?? ''} />
      </label>

      <label>
        <span>Description détaillée (facultatif)</span>
        <textarea name="detailed_description" rows={5} defaultValue={activity?.detailed_description ?? ''} />
      </label>

      <div className="admin-form-row">
        <label>
          <span>Date</span>
          <input type="date" name="event_date" defaultValue={activity?.event_date ?? ''} />
        </label>
        <label>
          <span>Heure</span>
          <input type="time" name="event_time" defaultValue={activity?.event_time ?? ''} />
        </label>
      </div>

      <label>
        <span>Lieu</span>
        <input type="text" name="location" defaultValue={activity?.location ?? ''} placeholder="Laisse vide si non connu (affichera « Lieu à venir »)" />
      </label>

      <div className="admin-form-row">
        <label>
          <span>Statut</span>
          <select name="status" defaultValue={activity?.status ?? 'past'}>
            <option value="past">Passée</option>
            <option value="announced">À venir (annonce)</option>
          </select>
        </label>
        <label>
          <span>Ordre d’affichage</span>
          <input type="number" name="display_order" defaultValue={activity?.display_order ?? 0} />
        </label>
      </div>

      <label>
        <span>Photo de couverture {activity?.cover_image_url && '(déjà en place — laisse vide pour la garder)'}</span>
        <input type="file" name="cover_image" accept="image/*" />
      </label>
      {activity && <input type="hidden" name="current_cover_url" value={activity.cover_image_url ?? ''} />}

      {!activity && (
        <p className="muted" style={{fontSize: '.78rem'}}>
          Tu pourras ajouter plusieurs photos/vidéos à la galerie de cette activité juste après l’avoir créée.
        </p>
      )}

      <button type="submit" className="btn gold">{activity ? 'Enregistrer les modifications' : 'Créer l’activité'}</button>
    </form>
  );
}
