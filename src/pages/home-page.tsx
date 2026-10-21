import { useQuery } from '@tanstack/react-query';
import { ChevronRight, ChevronRightIcon, Megaphone, Pin } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { boardQueries } from '@/queries/board/board';
import { Board } from '@/types/common/board';

export const HomePage = () => {
  const { t } = useTranslation();

  // 게시글 목록 조회
  const { data } = useQuery(boardQueries.list());

  // 고정 공지 우선 + 최신순 정렬, 상위 4개만
  const visibleNotices = useMemo(() => {
    const byDateDesc = (a: Board, b: Board) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

    const pinned = data?.filter(n => n.isPin).sort(byDateDesc) ?? [];
    const others = data?.filter(n => !n.isPin).sort(byDateDesc) ?? [];

    return [...pinned, ...others].slice(0, 4);
  }, [data]);

  return (
    <div className="space-y-6">
      {/* 공지사항(게시판) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            <CardTitle>
              {t('col.home.notice', { defaultValue: '공지사항' })}
            </CardTitle>
          </div>
          {/* 게시판 목록 페이지 */}
         <Button
            asChild
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <Link to="/board">
              {t('col.home.notice.more', { defaultValue: '더보기' })}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent>
          {visibleNotices?.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t('col.home.notice.empty', { defaultValue: '표시할 공지가 없습니다.' })}
            </p>
          ) : (
            <ul className="divide-y">
              {visibleNotices?.map((n) => {
                // 상세 링크: 개별 url 없으면 기본 /board/:id
                const href = `/board/${n.id}`;
                return (
                  <li key={n.id} className="flex items-center justify-between py-3">
                    <div className="min-w-0">
                      <Link to={href} className="truncate text-sm hover:underline">
                        {n.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      {n.isPin && (
                        <Pin className="h-4 w-4 text-muted-foreground" aria-label="Pinned" />
                      )}
                      <Link to={href}>
                        <Button variant="ghost" size="sm">
                          {t('col.home.notice.view', { defaultValue: '상세 보기' })}
                          <ChevronRightIcon className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* 시스템 안내 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('home.welcome', { defaultValue: '시스템 안내' })}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            {t('home.desc.1', {
              defaultValue:
                '이 시스템은 xxxxxxxxx 를 제공합니다.',
            })}
          </p>
          <p>
            {t('home.desc.2', {
              defaultValue:
                '공지사항은 게시판을 통해 제공되며, 상단에는 중요한 공지(고정)가 먼저, 이후 최신순으로 표시됩니다.',
            })}
          </p>
          <p>
            {t('home.desc.3', {
              defaultValue:
                '자세한 내용은 상단의 더보기 버튼을 눌러 게시판 목록에서 확인하세요.',
            })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;