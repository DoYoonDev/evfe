import { CodeForm } from '@/components/code';
import { PageTitle } from '@/components/common';

export const CodeNewPage = () => {
  return (
    <>
      <PageTitle
        i18nKey="col.code.new"
        defaultValue="코드 등록"
      />
      <div className="mt-5 flex flex-col gap-5">
        <CodeForm />
      </div>
    </>
  );
};

export default CodeNewPage;  