'use client';
import Image from 'next/image';

const VIDEO_EXT = ['.mp4', '.webm', '.mov'];

export function isVideo(src: string) {
  return VIDEO_EXT.some(ext => src.toLowerCase().endsWith(ext));
}

// Rend une image ou une vidéo selon l'extension du fichier — permet à la galerie
// et aux pages détail d'activité d'accepter indifféremment des photos et des vidéos,
// comme demandé dans la spécification d'origine ("Galerie : Images et vidéos").
export function Media({src, alt, width, height}: {src: string; alt: string; width: number; height: number}) {
  if (isVideo(src)) {
    return <video src={src} controls playsInline preload="metadata" style={{width: '100%', height: 'auto', display: 'block', borderRadius: 'inherit'}} aria-label={alt} />;
  }
  return <Image src={src} alt={alt} width={width} height={height} />;
}
