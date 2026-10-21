import { defaultAxios } from '@/config/api.ts';
import type {
  MessageUpdateRequest,
  Message,
  MessageCreateRequest,
  MessageSearch,
  MessagePage,
} from '@/types/admin/message.ts';
import { END_POINTS } from '@/constants/api.ts';

export const getMessage = async (id: string): Promise<Message> => {
  const response = await defaultAxios.get(`${END_POINTS.MESSAGE}/${id}`);

  return response.data.messageInfo;
};

export const getMessages = async (
  filter: MessageSearch,
): Promise<MessagePage> => {
  const response = await defaultAxios.get(END_POINTS.MESSAGE, {
    params: filter,
  });

  return response.data;
};

export const createMessage = async (
  request: MessageCreateRequest,
): Promise<boolean> => {
  const response = await defaultAxios.post(END_POINTS.MESSAGE, request);

  return response.data;
};

export const updateMessage = async ({
  id,
  koText,
  enText,
  isActive,
  originalId,
}: MessageUpdateRequest): Promise<boolean> => {
  const response = await defaultAxios.put(
    `${END_POINTS.MESSAGE}/${originalId}`,
    {
      id,
      koText,
      enText,
      isActive,
    },
  );

  return response.data;
};

export const deleteMessage = async (id: string): Promise<boolean> => {
  const response = await defaultAxios.delete(`${END_POINTS.MESSAGE}/${id}`);

  return response.data;
};

export const deployTranslatedMessagesAll = async (): Promise<boolean> => {
  const response = await defaultAxios.get(
    `${END_POINTS.MESSAGE}/translated/deploy-all`,
  );

  return response.data;
};
