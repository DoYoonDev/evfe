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
import { cn } from '@/lib/utils';

import { useCodeDispatch, useCodeState } from '../_hooks/use-code';

export const CodeSearch = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const { code } = useCodeState();
  const { id, groupId, name, isActive, description } = code.search;
  const dispatch = useCodeDispatch();

  const handleSearch = (field: string, value: string | boolean) => {
    dispatch({
      type: 'SET_SEARCH',
      payload: { ...code.search, [field]: value },
    });
  };

  return (
    <div className={cn('flex justify-end gap-2', className)}>
      <DebouncedInput
        placeholder={t('col.code.id', { defaultValue: '코드 아이디' })}
        value={id}
        onChange={(value) => handleSearch('id', value)}
        className="max-w-48"
      />
      <DebouncedInput
        placeholder={t('col.code.group.id', {
          defaultValue: '코드그룹 아이디',
        })}
        value={groupId}
        onChange={(value) => handleSearch('groupId', value)}
        className="max-w-48"
      />
      <DebouncedInput
        placeholder={t('col.code.name', { defaultValue: '코드명' })}
        value={name}
        onChange={(value) => handleSearch('name', value)}
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
      <DebouncedInput
        placeholder={t('col.code.desc', { defaultValue: '코드 설명' })}
        value={description}
        onChange={(value) => handleSearch('description', value)}
        className="max-w-48"
      />
    </div>
  );
};
