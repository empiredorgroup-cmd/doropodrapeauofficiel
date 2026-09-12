import type {Metadata} from 'next';
import {ActivityForm} from '@/components/admin/activity-form';
import {createActivityAction} from '../actions';

export const metadata: Metadata = {title: 'Nouvelle activité'};
export const dynamic = 'force-dynamic';

export default function NewActivityPage() {
  return <ActivityForm action={createActivityAction} />;
}
