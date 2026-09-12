import type {Metadata} from 'next';
import {MemberForm} from '@/components/admin/member-form';
import {createMemberAction} from '../actions';

export const metadata: Metadata = {title: 'Nouveau membre'};
export const dynamic = 'force-dynamic';

export default function NewMemberPage() {
  return <MemberForm action={createMemberAction} />;
}
