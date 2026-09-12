import {notFound} from 'next/navigation';
import {createClient} from '@/lib/supabase/server';
import {ReportForm, type ReportRow} from '@/components/admin/report-form';
import {updateReportAction} from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditReportPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const supabase = await createClient();
  const {data} = await supabase.from('annual_reports').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();

  const report = data as ReportRow;
  return <ReportForm report={report} action={updateReportAction.bind(null, report.id)} />;
}
