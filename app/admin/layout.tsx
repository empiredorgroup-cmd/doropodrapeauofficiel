import {createServerClient, type CookieOptions} from '@supabase/ssr';
import {NextResponse, type NextRequest} from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({request});

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: {name: string; value: string; options: CookieOptions}[]) {
          cookiesToSet.forEach(({name, value}) => request.cookies.set(name, value));
          response = NextResponse.next({request});
          cookiesToSet.forEach(({name, value, options}) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const {data: {user}} = await supabase.auth.getUser();

  // trailingSlash:true (next.config.ts) fait que le vrai chemin est "/admin/login/", pas "/admin/login" :
  // on normalise avant de comparer, sinon la page de connexion n'est jamais reconnue → boucle de redirection.
  const pathname = request.nextUrl.pathname.replace(/\/$/, '') || '/';
  const isLoginPage = pathname === '/admin/login';
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute && !isLoginPage && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login/';
    return NextResponse.redirect(url);
  }
  if (isLoginPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
