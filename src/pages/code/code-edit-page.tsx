import { CodeEditForm } from '@/components/code';
import { PageTitle } from '@/components/common';

export const CodeEditPage = () => {
   return (
    <>
      <PageTitle
        i18nKey="col.code.edit"
        defaultValue="코드 수정"
      />
      <div className="mt-5 flex flex-col gap-5">
        <CodeEditForm />
      </div>
    </>
  );
};

export default CodeEditPage;