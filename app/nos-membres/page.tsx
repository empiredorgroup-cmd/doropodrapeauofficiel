import type {Metadata} from 'next';
import {createClient} from '@/lib/supabase/server';
import {ClickableMedia} from '@/components/lightbox';
import type {MemberRow} from '@/components/admin/member-form';
import {legacyMemberPhoto} from '@/lib/legacy-media-bridge';

export const metadata: Metadata = {title: 'Nos membres actuels', description: 'Présentation des membres retenus pour la composition actuelle de DOROPO DRAPEAU.'};
export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = await createClient();
  const {data} = await supabase
    .from('members')
    .select('*')
    .eq('is_active', true)
    .order('display_order', {ascending: true});

  const members = (data ?? []) as MemberRow[];

  return (
    <main>
      <section className="section page-hero">
        <div className="container">
          <div className="eyebrow">Notre équipe</div>
          <h1 className="title">Nos membres actuels</h1>
          <p className="lead">Cette présentation reprend les personnes et fonctions retenues dans le document interne de référence fourni pour cette rubrique.</p>
        </div>
      </section>
      <section className="section">
        <div className="container grid cards-3 member-grid">
          {members.map(m => {
            const photo = m.photo_url || legacyMemberPhoto(m.full_name);
            return (
            <article className="card member-card" key={m.id}>
              <div className="member-photo">
                {photo ? <ClickableMedia src={photo} alt={`Photo de ${m.full_name}`} width={400} height={400} /> : <div className="media-missing" aria-hidden="true" />}
              </div>
              <div className="eyebrow">{m.role}</div>
              <h2>{m.full_name}</h2>
              {m.description && <p className="muted">{m.description}</p>}
            </article>
          );})}
        </div>
      </section>
    </main>
  );
}
