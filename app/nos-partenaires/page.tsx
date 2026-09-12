import type {Metadata} from 'next';
import {createClient} from '@/lib/supabase/server';
import {ClickableMedia} from '@/components/lightbox';
import type {PartnerRow} from '@/components/admin/partner-form';
import {legacyPartnerLogo} from '@/lib/legacy-media-bridge';

export const metadata: Metadata = {title: 'Nos partenaires', description: 'Partenaires de DOROPO DRAPEAU et acteurs qui accompagnent ses initiatives.'};
export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = await createClient();
  const {data} = await supabase
    .from('partners')
    .select('*')
    .eq('is_active', true)
    .order('display_order', {ascending: true});

  const partners = (data ?? []) as PartnerRow[];

  return (
    <main>
      <section className="section page-hero">
        <div className="container">
          <div className="eyebrow">Notre réseau</div>
          <h1 className="title">Nos partenaires</h1>
          <p className="lead">DOROPO DRAPEAU s’appuie sur des relations locales et des collaborations destinées à renforcer ses initiatives communautaires, éducatives, culturelles et sociales.</p>
        </div>
      </section>
      <section className="section">
        <div className="container grid cards-3">
          {partners.map(p => {
            const logo = p.logo_url || legacyPartnerLogo(p.name);
            return (
            <article className="card partner-card" key={p.id}>
              <div className="partner-media">
                {logo ? <ClickableMedia src={logo} alt={`Visuel de ${p.name}`} width={600} height={400} /> : <div className="media-missing" aria-hidden="true" />}
              </div>
              <div className="eyebrow">Partenaire</div>
              <h2>{p.name}</h2>
              {p.description && <p className="muted">{p.description}</p>}
              {p.website_url && <a href={p.website_url} target="_blank" rel="noreferrer" className="text-link">Visiter le site</a>}
            </article>
          );})}
        </div>
      </section>
    </main>
  );
}
