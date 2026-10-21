import { SearchIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { getSearchableMemberColumns } from '@/components/member/_components/member-columns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ColumnOption = {
  label: string;
  value: string;
};

type Props = {
  inputKeyword: string;
  setInputKeyword: (v: string) => void;
  selectedColumn: string;
  setSelectedColumn: (v: string) => void;
  onSearch: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  columnOptions?: ColumnOption[];
};

export const MemberSearch = ({
  inputKeyword,
  setInputKeyword,
  selectedColumn,
  setSelectedColumn,
  onSearch,
  onKeyDown,
  columnOptions,
}: Props) => {
  const { t } = useTranslation();

  const defaultOptions = useMemo(() => getSearchableMemberColumns(t), [t]);
  const options = columnOptions ?? defaultOptions;

  return (
    <div className="flex items-center space-x-2">
      {/* 검색 컬럼 선택 */}
      <Select value={selectedColumn} onValueChange={setSelectedColumn}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder={t('placeholder.selectColumn', { defaultValue: '컬럼 선택' })} />
        </SelectTrigger>
        <SelectContent>
          {options.map((col) => (
            <SelectItem key={col.value} value={col.value}>
              {col.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 검색어 입력 */}
      <Input
        placeholder={t('placeholder.enterKeyword', { defaultValue: '검색어 입력' })}
        value={inputKeyword}
        onChange={(e) => setInputKeyword(e.target.value)}
        onKeyDown={onKeyDown}
      />

      {/* 검색 버튼 */}
      <Button
        type="button"
        onClick={onSearch}
        variant="outline"
        className="flex items-center gap-2"
      >
        <SearchIcon className="h-4 w-4" />
        {t('btn.search', { defaultValue: '검색' })}
      </Button>
    </div>
  );
};
