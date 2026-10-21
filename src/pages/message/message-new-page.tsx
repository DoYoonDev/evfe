import { PageTitle } from '@/components/common';
import { MessageForm } from '@/components/message';

export const MessageNewPage = () => {
  return (
    <>
      <PageTitle
        i18nKey="col.message.new"
        defaultValue="메시지 등록"
      />
      <div className="mt-5 flex flex-col gap-5">
        <MessageForm />
      </div>
    </>
  );
};

export default MessageNewPage;