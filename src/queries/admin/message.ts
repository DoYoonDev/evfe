import { queryOptions } from '@tanstack/react-query';

import { getMessage, getMessages } from '@/api/admin/message.ts';
import { MessageSearch } from '@/types/admin/message.ts';
import { QUERY_KEYS } from '@/constants/query-key.ts';

export const messagesQueries = {
  all: () => [QUERY_KEYS.MESSAGES],

  details: (id: string) => [...messagesQueries.all(), QUERY_KEYS.DETAIL, id],
  detail: (id: string) =>
    queryOptions({
      queryKey: [...messagesQueries.details(id)],
      queryFn: () => getMessage(id),
    }),

  lists: () => [...messagesQueries.all(), QUERY_KEYS.LIST],
  list: (filter: MessageSearch) =>
    queryOptions({
      queryKey: [...messagesQueries.lists(), filter],
      queryFn: () => getMessages(filter),
      select: (data: any) => {
        return data.messageInfos;
      },
    }),
};
