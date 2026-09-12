import type {Metadata} from 'next';
import {ReportForm} from '@/components/admin/report-form';
import {createReportAction} from '../actions';

export const metadata: Metadata = {title: 'Nouveau bilan'};
export const dynamic = 'force-dynamic';

export default function NewReportPage() {
  return <ReportForm action={createReportAction} />;
}
