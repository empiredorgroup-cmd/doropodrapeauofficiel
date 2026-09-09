import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';

export type NewsRow = {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  video_url: string | null;
  document_url: string | null;
  event_date: string | null;
  event_time: string | null;
  location: string | null;
  caption: string | null;
  facebook_link: string | null;
  status: string;
};

export function NewsForm({news, action}: {news?: NewsRow; action: (formData: FormData) => void}) {
  return (
    <form action={action} className="admin-form">
      <Link className="back" href="/admin/actualites"><ArrowLeft size={15} /> Retour aux actualités</Link>
      <h1 className="admin-title">{news ? 'Modifier l’actualité' : 'Nouvelle actualité'}</h1>

      <label>
        <span>Titre *</span>
        <input type="text" name="title" required defaultValue={news?.title} />
      </label>

      <label>
        <span>Contenu</span>
        <textarea name="content" rows={6} defaultValue={news?.content ?? ''} />
      </label>

      <div className="admin-form-row">
        <label>
          <span>Date de l’événement</span>
          <input type="date" name="event_date" defaultValue={news?.event_date ?? ''} />
        </label>
        <label>
          <span>Heure</span>
          <input type="time" name="event_time" defaultValue={news?.event_time ?? ''} />
        </label>
      </div>

      <label>
        <span>Lieu</span>
        <input type="text" name="location" defaultValue={news?.location ?? ''} />
      </label>

      <label>
        <span>Légende</span>
        <input type="text" name="caption" defaultValue={news?.caption ?? ''} />
      </label>

      <label>
        <span>Lien Facebook (facultatif)</span>
        <input type="url" name="facebook_link" placeholder="https://facebook.com/..." defaultValue={news?.facebook_link ?? ''} />
      </label>

      <div className="admin-form-row">
        <label>
          <span>Image {news?.image_url && '(déjà en place — laisse vide pour la garder)'}</span>
          <input type="file" name="image" accept="image/*" />
        </label>
        <label>
          <span>Vidéo {news?.video_url && '(déjà en place — laisse vide pour la garder)'}</span>
          <input type="file" name="video" accept="video/*" />
        </label>
        <label>
          <span>Document {news?.document_url && '(déjà en place — laisse vide pour la garder)'}</span>
          <input type="file" name="document" accept=".pdf,.doc,.docx" />
        </label>
      </div>
      {news && (
        <>
          <input type="hidden" name="current_image_url" value={news.image_url ?? ''} />
          <input type="hidden" name="current_video_url" value={news.video_url ?? ''} />
          <input type="hidden" name="current_document_url" value={news.document_url ?? ''} />
        </>
      )}

      <label>
        <span>Statut</span>
        <select name="status" defaultValue={news?.status ?? 'draft'}>
          <option value="draft">Brouillon</option>
          <option value="published">Publié</option>
        </select>
      </label>

      <button type="submit" className="btn gold">{news ? 'Enregistrer les modifications' : 'Créer l’actualité'}</button>
    </form>
  );
}
