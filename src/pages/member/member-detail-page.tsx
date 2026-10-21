import { PageTitle } from '@/components/common';
import { MemberDeleteDialog, MemberDetail } from '@/components/member';

export const MemberDetailPage = () => {
  return (
    <>
      <PageTitle
        i18nKey="col.member.detail"
        defaultValue="사용자 상세"
      />
      <div className="mt-5 flex flex-col gap-5">
        <MemberDetail />
      </div>
      <MemberDeleteDialog />
    </>
  );
};

export default MemberDetailPage;