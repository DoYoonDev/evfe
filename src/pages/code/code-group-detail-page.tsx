import { CodeGroupDeleteDialog, CodeGroupDetail } from '@/components/code-group';
import { PageTitle } from '@/components/common';

export const CodeGroupDetailPage = () => {
  return (
    <>
      <PageTitle
        i18nKey="col.code.group.detail"
        defaultValue="코드그룹 상세"
      />
      <div className="mt-5 flex flex-col gap-5">
        <CodeGroupDetail />
      </div>
      <CodeGroupDeleteDialog />
    </>
  );
};

export default CodeGroupDetailPage;