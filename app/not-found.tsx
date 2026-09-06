import Link from 'next/link';
export default function NotFound(){return <main><section className="section"><div className="container prose"><div className="eyebrow">404</div><h1 className="title">Page introuvable</h1><p className="lead">Cette page n’existe pas ou n’est plus disponible.</p><Link className="btn gold" href="/">Retour à l’accueil</Link></div></section></main>}
