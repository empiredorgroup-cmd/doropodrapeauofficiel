'use client';
import {useRef, useState, useTransition} from 'react';
import {Trash2, Plus, Loader2} from 'lucide-react';

export type GalleryItem = {id: string; url: string; type: 'image' | 'video'};
type AddResult = {ok: true; items: GalleryItem[]} | {ok: false; message: string};
type DeleteResult = {ok: true} | {ok: false; message: string};

export function MediaGalleryManager({
  items,
  addAction,
  deleteAction,
}: {
  items: GalleryItem[];
  addAction: (formData: FormData) => Promise<AddResult>;
  deleteAction: (id: string) => Promise<DeleteResult>;
}) {
  const [rows, setRows] = useState(items);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleDelete(id: string) {
    if (!confirm('Supprimer ce média ?')) return;
    startTransition(async () => {
      const res = await deleteAction(id);
      if (res.ok) setRows(prev => prev.filter(r => r.id !== id));
      else alert(`Suppression impossible : ${res.message}`);
    });
  }

  function handleAdd(formData: FormData) {
    startTransition(async () => {
      const res = await addAction(formData);
      if (res.ok) {
        setRows(prev => [...prev, ...res.items]);
        formRef.current?.reset();
      } else {
        alert(`Ajout impossible : ${res.message}`);
      }
    });
  }

  return (
    <div className="admin-gallery-manager">
      {rows.length > 0 && (
        <div className="admin-gallery-grid">
          {rows.map(item => (
            <div className="admin-gallery-item" key={item.id}>
              {item.type === 'video' ? <video src={item.url} muted /> : <img src={item.url} alt="" />}
              <button type="button" onClick={() => handleDelete(item.id)} disabled={pending} aria-label="Supprimer ce média">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      <form ref={formRef} action={handleAdd} className="admin-gallery-add">
        <label>
          <span>Ajouter des photos/vidéos (plusieurs fichiers à la fois possibles)</span>
          <input type="file" name="files" accept="image/*,video/*" multiple required />
        </label>
        <button type="submit" className="btn ghost" disabled={pending}>
          {pending ? <Loader2 size={15} className="spin" /> : <Plus size={15} />} Ajouter à la galerie
        </button>
      </form>
    </div>
  );
}
