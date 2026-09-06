import type {NextConfig} from 'next';
// NOTE : "output: export" a été retiré — un espace admin avec authentification par session a besoin
// d'un serveur Next.js actif (routes dynamiques, middleware). Vercel exécute cela nativement pour
// tout projet Next.js standard ; le site public continue de fonctionner à l'identique.
const nextConfig: NextConfig = { trailingSlash: true, images: { unoptimized: true } };
export default nextConfig;
