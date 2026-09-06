import type {Metadata} from 'next'; import Link from 'next/link'; import {notFound} from 'next/navigation'; import {ArrowLeft,CalendarDays,MapPin,Sparkles} from 'lucide-react'; import {activities,FALLBACK_IMAGE} from '@/lib/content'; import {resolveActivityMedia} from '@/lib/media-resolver'; import {ClickableMedia} from '@/components/lightbox'; import {GalleryView} from '@/components/gallery-view';
export function generateStaticParams(){return activities.map(a=>({id:a.id}))}
export async function generateMetadata({params}:{params:Promise<{id:string}>}):Promise<Metadata>{const {id}=await params;const a=activities.find(x=>x.id===id);return a?{title:a.title,description:a.summary}:{title:'Activité introuvable'}}
export default async function Page({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const a=activities.find(x=>x.id===id);
  if(!a)notFound();
  const media=resolveActivityMedia(a.mediaPrefix,a.mediaCount);
  const cover=a.image||(media.find(m=>m.type==='image')?.src)||FALLBACK_IMAGE;
  const galleryMedia=media.map((m,i)=>({id:`${a.id}-${i}`,src:m.src,type:m.type,alt:`${a.title} — média ${i+1}`}));
  return <main><section className="section detail-hero"><div className="container"><Link className="back" href="/nos-activites"><ArrowLeft size={15}/> Retour aux activités</Link><div className="eyebrow">{a.status==='past'?'ARCHIVES':'ANNONCE'}</div><h1 className="title">{a.title}</h1><div className="detail-meta"><span><CalendarDays size={16}/>{a.dateLabel}</span><span><MapPin size={16}/>{a.place}</span>{a.status==='announced'&&<span><Sparkles size={16}/>À venir</span>}</div><div className="detail-grid"><div><p className="rich">{a.summary}</p>{a.id==='excellia-2'&&<p className="muted">Les informations de date et de lieu seront publiées ultérieurement.</p>}{a.id==='nuit-retro'&&<p className="muted">Annonce de l’événement : aucune date ni aucun lieu ne sont arrêtés dans les informations actuellement disponibles.</p>}</div><div className="detail-image"><ClickableMedia src={cover} alt={a.title} width={900} height={650}/></div></div>{media.length>1&&<div style={{marginTop:40}}><GalleryView media={galleryMedia}/></div>}</div></section></main>;
}
