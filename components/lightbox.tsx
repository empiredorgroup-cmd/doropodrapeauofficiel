'use client';
import {useState} from 'react';
import {ZoomIn, X} from 'lucide-react';
import {Media} from '@/components/media';

// Rend une seule image/vidéo cliquable : au clic, elle s'ouvre seule en grand (lightbox).
// Utilisé partout où une photo est affichée hors d'une grille de galerie (couverture d'activité,
// visuel de partenaire, photo de membre...).
export function ClickableMedia({src, alt, width, height}: {src: string; alt: string; width: number; height: number}) {
  const [open, setOpen] = useState(false);
  return <>
    <button type="button" className="clickable-media" onClick={() => setOpen(true)} aria-label={`Agrandir : ${alt}`}>
      <Media src={src} alt={alt} width={width} height={height} />
      <span className="gallery-zoom"><ZoomIn size={17} /></span>
    </button>
    {open && (
      <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={() => setOpen(false)}>
        <button onClick={() => setOpen(false)} aria-label="Fermer"><X /></button>
        <Media src={src} alt={alt} width={1100} height={900} />
      </div>
    )}
  </>;
}
