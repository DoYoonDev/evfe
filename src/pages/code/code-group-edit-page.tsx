import { CodeGroupEditForm } from '@/components/code-group';
import { PageTitle } from '@/components/common';

export const CodeGroupEditPage = () => {
  return (
    <>
      <PageTitle
        i18nKey="col.code.group.edit"
        defaultValue="코드그룹 수정"
      />
      <div className="mt-5 flex flex-col gap-5">
        <CodeGroupEditForm />
      </div>
    </>
  );
};

export default CodeGroupEditPage;