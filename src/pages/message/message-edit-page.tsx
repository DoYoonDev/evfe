import { PageTitle } from '@/components/common';
import { MessageEditForm } from '@/components/message';

export const MessageEditPage = () => {
  return (
    <>
      <PageTitle
        i18nKey="col.message.edit"
        defaultValue="메시지 수정"
      />
      <div className="mt-5 flex flex-col gap-5">
        <MessageEditForm />
      </div>
    </>
  );
};

export default MessageEditPage;