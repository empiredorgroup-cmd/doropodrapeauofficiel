import {notFound} from 'next/navigation';
import {createClient} from '@/lib/supabase/server';
import {NewsForm, type NewsRow} from '@/components/admin/news-form';
import {updateNewsAction} from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditNewsPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const supabase = await createClient();
  const {data} = await supabase.from('news').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();

  const news = data as NewsRow;
  return <NewsForm news={news} action={updateNewsAction.bind(null, news.id)} />;
}
