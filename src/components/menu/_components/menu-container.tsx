import { useMutation } from '@tanstack/react-query';
import _ from 'lodash';
import { useEffect, useMemo, useRef } from 'react';
import {
  StaticTreeDataProvider,
  TreeItem,
  TreeItemIndex,
} from 'react-complex-tree';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { updateMenuPosition } from '@/api/admin/menu.ts';
import type { Menu, MenuUpdatePositionRequest } from '@/types/common/menu.ts';

import { useMenuState } from '../_hooks/use-menu.tsx';
import { MenuDialogProvider } from '../_hooks/use-menu-dialog.tsx';
import { MenuCreateDialog } from './menu-create-dialog.tsx';
import { MenuForm } from './menu-form.tsx';
import { MenuList } from './menu-list.tsx';

const defaultTreeItems = {
  root: {
    index: 'root',
    isFolder: true,
    children: ['sub'],
    data: null,
  },
  sub: {
    index: 'sub',
    isFolder: true,
    children: [],
    data: { name: '메뉴관리', messageId: 'menu.menu' },
  },
};

const createTreeItems = (menus: Menu[]) => {
  const items = menus.reduce<Record<string, TreeItem>>((acc, menu) => {
    const children = menus
      .filter((item) => item.parentMenuId === menu.id)
      .map((item) => item.id);

    acc[menu.id] = {
      index: menu.id,
      isFolder: !!children.length,
      children,
      data: menu,
    };

    return acc;
  }, {});

  return {
    ...defaultTreeItems,
    sub: {
      ...defaultTreeItems.sub,
      children: menus.filter((item) => item.level === 1).map((item) => item.id),
    },
    ...items,
  };
};

export const MenuContainer = () => {
  const { t } = useTranslation();
  const { menus } = useMenuState();

  const initialTreeItems = useRef<Record<TreeItemIndex, TreeItem> | null>(
    null,
  );

  const treeItems = useMemo<Record<TreeItemIndex, TreeItem>>(() => {
    if (menus.length === 0) return defaultTreeItems;

    return createTreeItems(menus);
  }, [menus]);

  const dataProvider = useMemo(() => {
    return new StaticTreeDataProvider(treeItems, (item, data) => ({
      ...item,
      data,
    }));
  }, [treeItems]);

  useEffect(() => {
    initialTreeItems.current = _.cloneDeep(treeItems);
  }, [treeItems]);

  const resetTreeItems = () => {
    if (!initialTreeItems.current) return;

    const candidates: string[] = [];

    Object.keys(treeItems).forEach((key) => delete treeItems[key]);
    Object.keys(initialTreeItems.current).forEach((key) => {
      treeItems[key] = _.cloneDeep(initialTreeItems.current![key]);
      candidates.push(key);
    });

    dataProvider.onDidChangeTreeDataEmitter.emit([...candidates]);
  };

  const saveTreeMutation = useMutation({
    mutationFn: updateMenuPosition,
  });

  const saveTreeItems = () => {
    const saveData = positionMenuData(treeItems);
    saveTreeMutation.mutate(saveData, {
      onSuccess: () => {
        toast.success(
          t('msg.menu.position.saved', {
            defaultValue: '메뉴 위치가 저장되었습니다.',
          }),
        );
      },
      onError: (error) => {
        console.error(error);
        toast.error(
          t('msg.menu.position.save.fail', {
            defaultValue: '메뉴 위치 저장에 실패했습니다.',
          }),
        );
      },
    });
  };

  const positionMenuData = (
    data: Record<TreeItemIndex, TreeItem>,
  ): MenuUpdatePositionRequest => {
    const result: MenuUpdatePositionRequest = {};

    const processLevel = (parentKey: string, items: TreeItemIndex[]) => {
      const levelData: { [key: TreeItemIndex]: TreeItemIndex[] } = {};
      for (const key of items) {
        const item = data[key];
        if (item && item.children && item.children.length > 0) {
          levelData[item.data!.id] = [...item.children];
        }
      }
      result[parentKey] = levelData;
    };

    // level 1
    const level1Key = 'level1';
    const level1Children = data.sub.children as TreeItemIndex[];
    result[level1Key] = level1Children.map((key) => data[key].data.id);

    // level 2
    const level2Key = 'level2';
    processLevel(level2Key, level1Children);

    // level 3
    const level3Key = 'level3';
    const level2Children = Object.values(result[level2Key]).flat();
    processLevel(level3Key, level2Children);

    return result;
  };

  const fixLocalTreeItems = () => {
    const emit: TreeItemIndex[] = [];
    Object.keys(treeItems).forEach((key) => {
      treeItems[key].isFolder =
        treeItems[key].children && treeItems[key].children.length > 0;
      emit.push(key);
    });
    dataProvider.onDidChangeTreeDataEmitter.emit(emit);
  };

  const updateLocalTreeItem = ({
    targetId,
    emit,
    data,
  }: {
    targetId: number;
    emit: TreeItemIndex[];
    data: Partial<TreeItem<Menu>>;
  }) => {
    treeItems[targetId] = {
      ...treeItems[targetId],
      ...data,
    };
    dataProvider.onDidChangeTreeDataEmitter.emit([...emit]);
  };

  const createTreeItem = (
    id: number,
    parentMenuId: string | number | null,
    data: TreeItem,
  ) => {
    const _parentMenuId = parentMenuId ?? 'sub';

    if (treeItems[_parentMenuId]?.children === undefined) return;

    treeItems[id] = data;
    treeItems[_parentMenuId].isFolder = true;
    treeItems[_parentMenuId].children!.push(id);
    dataProvider.onDidChangeTreeDataEmitter.emit([_parentMenuId]);
  };

  const updateTreeItem = (id: number, data: TreeItem) => {
    treeItems[id] = data;
    dataProvider.onDidChangeTreeDataEmitter.emit([id]);
  };

  const deleteTreeItem = (id: number, parentMenuId: string | number | null) => {
    const _parentMenuId = parentMenuId ?? 'sub';

    if (
      !treeItems[_parentMenuId].children ||
      treeItems[_parentMenuId].children?.length === 0
    ) {
      return;
    }

    delete treeItems[id];
    const targetIndex = treeItems[_parentMenuId].children.indexOf(id);
    if (targetIndex === -1) {
      throw new Error(
        t('msg.common.deleteTargetNotFound', { defaultValue: '삭제할 대상을 찾을 수 없습니다.' })
      );
    }

    treeItems[_parentMenuId].children.splice(targetIndex, 1);
    treeItems[_parentMenuId].isFolder =
      !!treeItems[_parentMenuId].children.length;

    dataProvider.onDidChangeTreeDataEmitter.emit([_parentMenuId]);
  };

  return (
    <>
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_2fr]">
        <div className="h-auto">
          <MenuDialogProvider>
            <MenuList
              dataProvider={dataProvider}
              items={treeItems}
              resetTreeItems={resetTreeItems}
              saveTreeItems={saveTreeItems}
              updateLocalTreeItem={updateLocalTreeItem}
              fixLocalTreeItems={fixLocalTreeItems}
            />
            <MenuCreateDialog createTreeItem={createTreeItem} />
          </MenuDialogProvider>
        </div>
        <div className="h-auto">
          <MenuForm
            updateTreeItem={updateTreeItem}
            deleteTreeItem={deleteTreeItem}
          />
        </div>
      </div>
    </>
  );
};
