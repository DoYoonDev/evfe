import { CodeGroupForm } from '@/components/code-group';
import { PageTitle } from '@/components/common';

export const CodeGroupNewPage = () => {
  return (
    <>
      <PageTitle
        i18nKey="col.code.group.new"
        defaultValue="코드그룹 등록"
      />
      <div className="mt-5 flex flex-col gap-5">
        <CodeGroupForm />
      </div>
    </>
  );
};

export default CodeGroupNewPage;