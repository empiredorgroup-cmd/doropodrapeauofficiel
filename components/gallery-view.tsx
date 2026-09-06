'use client'; import {X,ZoomIn} from 'lucide-react'; import {useState} from 'react'; import {Media} from '@/components/media';

type MediaItem = {id:string; src:string; type:'image'|'video'; alt:string};

export function GalleryView({media}:{media:MediaItem[]}) {
  const [active, setActive] = useState<number | null>(null);
  if (media.length === 0) {
    return <div className="card empty-state"><ZoomIn/><div><h2>Galerie en préparation</h2><p className="muted">Les photos et vidéos des activités apparaîtront ici au fur et à mesure de leur ajout.</p></div></div>;
  }
  return <>
    <div className="gallery-grid">
      {media.map((m, i) => (
        <button className="gallery-tile" key={m.id} onClick={() => setActive(i)} aria-label={`Agrandir le média ${i + 1}`}>
          <Media src={m.src} alt={m.alt} width={700} height={700} />
          <span className="gallery-zoom"><ZoomIn size={17} /></span>
        </button>
      ))}
    </div>
    {active !== null && (
      <div className="lightbox" role="dialog" aria-modal="true" aria-label="Aperçu du média" onClick={() => setActive(null)}>
        <button onClick={() => setActive(null)} aria-label="Fermer"><X /></button>
        <Media src={media[active].src} alt={media[active].alt} width={1100} height={900} />
      </div>
    )}
  </>;
}
