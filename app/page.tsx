import Image from 'next/image'; import Link from 'next/link'; import {ArrowRight,ArrowDown,CalendarDays,Users,Handshake,ShieldCheck,Newspaper,Sparkles} from 'lucide-react'; import {VisitorGate} from '@/components/visitor-gate'; import {FALLBACK_IMAGE} from '@/lib/content'; import {createClient} from '@/lib/supabase/server'; import {legacyActivityMedia} from '@/lib/legacy-media-bridge';

export const dynamic = 'force-dynamic';

type ActivityDbRow = {slug: string; title: string; status: 'past' | 'announced'; event_date: string | null; location: string | null; cover_image_url: string | null};

export default async function Home() {
  const supabase = await createClient();
  const {data} = await supabase
    .from('activities')
    .select('slug, title, status, event_date, location, cover_image_url')
    .order('display_order', {ascending: true})
    .limit(6);
  const rows = (data ?? []) as ActivityDbRow[];

  const previews = rows.map(r => ({
    slug: r.slug,
    title: r.title,
    status: r.status,
    dateLabel: r.event_date ? new Date(r.event_date).toLocaleDateString('fr-FR', {day: '2-digit', month: 'long', year: 'numeric'}) : 'Date à venir',
    place: r.location || 'Lieu à venir',
    cover: r.cover_image_url || legacyActivityMedia(r.slug).find(m => m.type === 'image')?.src || FALLBACK_IMAGE,
  }));

  return <><VisitorGate/><main><section className="hero"><div className="orb o1"/><div className="orb o2"/><div className="hero-grid"/><div className="container hero-inner"><div className="eyebrow reveal">DOROPO · BOUNKANI · CÔTE D’IVOIRE</div><Image className="hero-logo reveal delay-1" src="/images/Logo 1.jpeg" alt="Logo DOROPO DRAPEAU" width={420} height={420} priority/><h1 className="title reveal delay-2">Une identité.<br/><span>Une communauté.</span><br/>Un engagement.</h1><p className="lead reveal delay-3">Association communautaire, sociale et apolitique, DOROPO DRAPEAU agit autour de la jeunesse, de la formation, de la cohésion sociale, de la culture et du développement à Doropo et dans le Bounkani.</p><div className="hero-actions"><Link className="btn gold" href="/nos-activites">Découvrir nos activités <ArrowRight size={17}/></Link><Link className="btn ghost" href="/qui-sommes-nous">Qui sommes-nous ?</Link></div></div><div className="scroll-hint"><ArrowDown size={15}/> Explorer</div></section><section className="section"><div className="container"><div className="eyebrow">Notre identité</div><h2 className="title">Construire du lien,<br/>agir localement.</h2><p className="lead">Les textes constitutifs placent au cœur de l’association la création d’une communauté forte et unie, la formation de la jeunesse, la promotion des valeurs traditionnelles, la paix, l’unité et la cohésion sociale.</p><div className="grid cards-3 stat-grid"><div className="card"><Users/><strong>Jeunesse</strong><span>Formation et épanouissement.</span></div><div className="card"><Handshake/><strong>Cohésion</strong><span>Unité, entraide et vivre-ensemble.</span></div><div className="card"><ShieldCheck/><strong>Engagement</strong><span>Action sociale et citoyenne à Doropo.</span></div></div></div></section><section className="section activities-preview"><div className="container"><div className="section-head"><div><div className="eyebrow">Nos activités</div><h2 className="title">Des actions qui<br/>laissent une trace.</h2></div><Link className="btn ghost" href="/nos-activites">Tout voir <ArrowRight size={17}/></Link></div><div className="grid cards-3">{previews.map(a=><Link href={`/nos-activites/${a.slug}`} className="activity-card card reveal" key={a.slug}><div className="activity-img"><Image src={a.cover} alt={a.title} width={600} height={420}/><span>{a.status==='announced'?<><Sparkles size={12}/> ANNONCE</>:'Archives'}</span></div><div className="activity-body"><div className="activity-meta"><CalendarDays size={14}/>{a.dateLabel}</div><h3>{a.title}</h3><p>{a.place}</p></div></Link>)}</div></div></section><section className="section dark-band"><div className="container band"><div><div className="eyebrow">EXCELLIA</div><h2 className="title">Former la parole,<br/>développer l’excellence.</h2><p className="lead">Le concours d’art oratoire s’inscrit dans une démarche de développement de la communication, de l’argumentation, de la créativité, de la confiance en soi et de la prise de parole en public.</p></div><Link className="btn gold" href="/nos-activites/excellia">Découvrir EXCELLIA <ArrowRight size={17}/></Link></div></section><section className="section"><div className="container"><div className="eyebrow">Le DD parleur</div><h2 className="title">L’actualité de<br/>DOROPO DRAPEAU.</h2><div className="card news-empty"><Newspaper size={30}/><div><h3>Les dernières actualités de l’association.</h3><p className="muted">Publications, annonces et comptes-rendus des activités de DOROPO DRAPEAU.</p></div><Link className="btn ghost" href="/dd-parleur">Voir le DD parleur</Link></div></div></section></main></>;
}
