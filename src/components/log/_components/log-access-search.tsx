import { format } from 'date-fns';
import { CalendarIcon, RotateCcwIcon, SearchIcon } from 'lucide-react';
import React from 'react'
import { DateRange } from 'react-day-picker';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type Props = {
  userId?: string;
  setUserId: (v: string) => void;
  accessedAt: DateRange | undefined;
  setAccessedAt: (v: DateRange | undefined) => void;
  onSearch: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const AccessLogSearch = ({
  userId,
  setUserId,
  accessedAt,
  setAccessedAt,
  onSearch,
  onKeyDown,
}: Props) => {
  const { t } = useTranslation();

  const onReset = () => {
    setUserId("");

    const now = new Date();
    const defaultTo = new Date(); // 오늘
    const defaultFrom = new Date(now.setDate(now.getDate() - 30)); // 30일 전
    setAccessedAt({
      from: defaultFrom,
      to: defaultTo,
    });
  };

  return (
    <div className='flex justify-center w-full'>
      <Card className='w-full shadow-sm rounded-lg items-center'>
        <CardContent className='flex flex-col md:flex-row items-center justify-between gap-4 min-h-[80px] bg-gray-50 dark:bg-gray-800 rounded-xl'>
          {/* 검색 필드 그룹 */}
          <div className='flex flex-col md:flex-row items-center gap-6'>
            {/* 사용자 ID */}
            <div className='flex items-center gap-2 w-full md:w-auto'>
              <span className='w-[120px] text-right text-sm font-semibold'>
                {t('col.log.memberId', { defaultValue: '사용자 ID' })}
              </span>
              <Input
                className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700'
                placeholder={t('placeholder.enterKeyword', { defaultValue: '검색어 입력' })}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                onKeyDown={onKeyDown}
              />
            </div>

            {/* 생성 일자 */}
            <div className='flex items-center gap-2 w-full md:w-auto'>
              <span className='w-[120px] text-right text-sm font-semibold'>
                {t('col.log.createdAt', { defaultValue: '생성 일자' })}
              </span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className='w-[250px] justify-start text-left font-normal'
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {accessedAt?.from ? (
                      accessedAt.to ? (
                        <>
                          {format(accessedAt.from, "yyyy-MM-dd")} ~ {format(accessedAt.to, "yyyy-MM-dd")}
                        </>
                      ) : (
                        format(accessedAt.from, "yyyy-MM-dd")
                      )
                    ) : (
                      <span>
                        {t('col.log.select.date', { defaultValue: '날짜 선택' })}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='range'
                    defaultMonth={accessedAt?.from}
                    numberOfMonths={2}
                    selected={accessedAt}
                    onSelect={setAccessedAt}
                    className='rounded-lg border shadow-sm'
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* 검색 버튼 */}
          <div className='flex gap-2'>
            <Button type="button" 
              variant="outline"
              onClick={onReset}
              className="flex items-center gap-2"
            >
              <RotateCcwIcon className="h-4 w-4" />
              {t('btn.reset', { defaultValue: '초기화' })}
            </Button>
            <Button 
              onClick={onSearch}
              variant="outline"
              className="flex items-center gap-2"
            >
              <SearchIcon className="h-4 w-4" />
              {t('btn.search', { defaultValue: '검색' })}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
};
