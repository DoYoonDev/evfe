import { useTranslation } from 'react-i18next';

import { DebouncedInput } from '@/components/custom-ui';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils.ts';

import { useMessageDispatch, useMessageState } from '../_hooks/use-message.tsx';

export const MessageSearch = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const { search } = useMessageState();
  const { id, koText, enText, isActive } = search;
  const dispatch = useMessageDispatch();

  const handleSearch = (field: string, value: string | boolean) => {
    dispatch({
      type: 'SET_SEARCH',
      payload: { ...search, [field]: value },
    });
  };

  return (
    <div className={cn('flex justify-end gap-2', className)}>
      <DebouncedInput
        placeholder={t('col.message.id', { defaultValue: '메시지 아이디' })}
        value={id}
        onChange={(value) => handleSearch('id', value)}
        className="max-w-48"
      />
      <DebouncedInput
        placeholder={t('col.message.ko', { defaultValue: '메시지-한국어' })}
        value={koText}
        onChange={(value) => handleSearch('koText', value)}
        className="max-w-48"
      />
      <DebouncedInput
        placeholder={t('col.message.en', { defaultValue: '메시지-영어' })}
        value={enText}
        onChange={(value) => handleSearch('enText', value)}
        className="max-w-48"
      />
      <Select
        value={isActive ? 'true' : 'false'}
        onValueChange={(e) => handleSearch('isActive', e === 'true')}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
           <SelectItem value="true">
              {t('common.enabled', { defaultValue: '활성화' })}
            </SelectItem>
            <SelectItem value="false">
              {t('common.disabled', { defaultValue: '비활성화' })}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
