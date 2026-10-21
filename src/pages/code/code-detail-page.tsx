import { CodeDeleteDialog, CodeDetail } from '@/components/code';
import { PageTitle } from '@/components/common';

export const CodeDetailPage = () => {
  return (
    <>
      <PageTitle
        i18nKey="col.code.detail"
        defaultValue="코드 상세"
      />
      <div className="mt-5 flex flex-col gap-5">
        <CodeDetail />
      </div>
      <CodeDeleteDialog />
    </>
  );
};

export default CodeDetailPage;  