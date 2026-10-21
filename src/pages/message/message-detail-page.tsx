import { PageTitle } from '@/components/common';
import { DeleteDialog, MessageDetail } from '@/components/message';

export const MessageDetailPage = () => {
  return (
    <>
      <PageTitle
        i18nKey="col.message.detail"
        defaultValue="메시지 상세"
      />
      <div className="mt-5 flex flex-col gap-5">
        <MessageDetail />
      </div>
      <DeleteDialog />
    </>
  );
};

export default MessageDetailPage;