import { CheckIcon, RotateCwIcon } from 'lucide-react';
import {
  type StaticTreeDataProvider,
  Tree,
  type TreeItem,
  type TreeItemIndex,
  UncontrolledTreeEnvironment,
} from 'react-complex-tree';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Menu } from '@/types/common/menu.ts';

import { useMenuDispatch } from '../_hooks/use-menu.tsx';
import { useMenuDialogDispatch } from '../_hooks/use-menu-dialog.tsx';
import { menuTreeRenderer } from './menu-tree-renderer';

export const MenuList = ({
  dataProvider,
  items,
  resetTreeItems,
  saveTreeItems,
  updateLocalTreeItem,
  fixLocalTreeItems,
}: {
  dataProvider: StaticTreeDataProvider;
  items: Record<TreeItemIndex, TreeItem>;
  resetTreeItems: () => void;
  saveTreeItems: () => void;
  updateLocalTreeItem: (props: {
    targetId: number;
    emit: TreeItemIndex[];
    data: Partial<TreeItem<Menu>>;
  }) => void;
  fixLocalTreeItems: () => void;
}) => {
  const { t } = useTranslation();
  const menuDispatch = useMenuDispatch();
  const menuDialogDispatch = useMenuDialogDispatch();

  const onSelectMenu = (selectItems: TreeItemIndex[]) => {
    if (selectItems.length === 0 || selectItems.length > 1) {
      return;
    }
    const itemIndex = selectItems[0];
    if (itemIndex === 'sub') return;

    menuDispatch({
      type: 'SET_SELECTED_MENU',
      payload: items[itemIndex],
    });
  };

  const onOpenMenuDialog = (item: TreeItem<Menu>) => {
    menuDialogDispatch({
      type: 'OPEN',
      payload: item,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t('col.menu.list', { defaultValue: '메뉴 목록' })}
        </CardTitle>
        <CardDescription>
          {t('msg.menu.select', {
            defaultValue: '메뉴를 선택하면 상세 정보를 조회할 수 있습니다.',
          })}
          <br />(
          {t('msg.menu.editDeleteTip', {
            defaultValue: '우측 상세 정보에서 수정 및 삭제가 가능합니다.',
          })}
          )
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UncontrolledTreeEnvironment
          dataProvider={dataProvider}
          getItemTitle={(item) =>
            t(item.data.messageId || '', { defaultValue: item.data.name })
          }
          viewState={{
            ['tree']: {
              expandedItems: ['sub'],
            },
          }}
          canDragAndDrop={true}
          canDropOnFolder={true}
          canReorderItems={true}
          canDropOnNonFolder={true}
          disableMultiselect
          {...menuTreeRenderer({ onOpenMenuDialog: onOpenMenuDialog })}
          onSelectItems={onSelectMenu}
          canDropAt={(_, target) => target.depth < 3}
          onDrop={(_, target) => {
            if ('targetItem' in target) {
              updateLocalTreeItem({
                targetId: target.targetItem as number,
                emit: [target.targetItem],
                data: { isFolder: true },
              });
            }
            fixLocalTreeItems();
          }}
        >
          <Tree treeId="tree" rootItem="root" />
        </UncontrolledTreeEnvironment>
      </CardContent>
      <CardFooter className="flex justify-end gap-x-4">
        <Button 
          type="button" 
          onClick={saveTreeItems}
          variant="success"
          className="flex items-center gap-2"
        >
          <CheckIcon />
          {t('btn.update.location', { defaultValue: '위치 저장' })}
        </Button>
        <Button 
          variant="outline"
          type="button"
          onClick={resetTreeItems}
          className="flex items-center gap-2"
        >
          <RotateCwIcon />
          {t('btn.reset', { defaultValue: '초기화' })}
        </Button>
      </CardFooter>
    </Card>
  );
};
