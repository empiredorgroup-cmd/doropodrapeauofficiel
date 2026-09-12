import type {Metadata} from 'next';
import {PartnerForm} from '@/components/admin/partner-form';
import {createPartnerAction} from '../actions';

export const metadata: Metadata = {title: 'Nouveau partenaire'};
export const dynamic = 'force-dynamic';

export default function NewPartnerPage() {
  return <PartnerForm action={createPartnerAction} />;
}
