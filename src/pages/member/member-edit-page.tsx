
import { PageTitle } from '@/components/common';
import { MemberEditForm } from '@/components/member';

export const MemberEditPage = () => {
  return (
    <>
      <PageTitle
        i18nKey="col.member.edit"
        defaultValue="사용자 수정"
      />
      <div className="mt-5 flex flex-col gap-5">
        <MemberEditForm />
      </div>
    </>
  );
};

export default MemberEditPage;