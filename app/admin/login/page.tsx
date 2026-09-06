'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {createClient} from '@/lib/supabase/client';
import {Lock} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const {error} = await supabase.auth.signInWithPassword({email, password});
    setLoading(false);
    if (error) {
      setError('Identifiants incorrects ou compte non autorisé.');
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <main className="admin-login-page">
      <form className="card admin-login-card gate-form" onSubmit={handleSubmit}>
        <div className="admin-login-icon"><Lock size={22} /></div>
        <div className="eyebrow">DOROPO DRAPEAU</div>
        <h1>Espace administration</h1>
        <label>
          <span>Email</span>
          <input type="email" required autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label>
          <span>Mot de passe</span>
          <input type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn gold gate-submit" disabled={loading}>{loading ? 'Connexion…' : 'Se connecter'}</button>
      </form>
    </main>
  );
}
