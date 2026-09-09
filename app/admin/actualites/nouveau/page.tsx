import type {Metadata} from 'next';
import {NewsForm} from '@/components/admin/news-form';
import {createNewsAction} from '../actions';

export const metadata: Metadata = {title: 'Nouvelle actualité'};
export const dynamic = 'force-dynamic';

export default function NewNewsPage() {
  return <NewsForm action={createNewsAction} />;
}
