import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  StaticTreeDataProvider,
  Tree,
  TreeItem,
  TreeItemIndex,
  UncontrolledTreeEnvironment,
} from 'react-complex-tree';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { updateRoleMenus } from '@/api/admin/role.ts';
import { useRoleMenuState } from '@/components/role-menu';
import { Button } from '@/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { roleQueries } from '@/queries/role/role.ts';
import type { RoleMenu } from '@/types/admin/role.ts';

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

const createTreeItems = (roleMenus: RoleMenu[]) => {
  const items = roleMenus.reduce<Record<string, TreeItem>>((acc, roleMenu) => {
    const menu = roleMenu.menu;
    const children = roleMenus
      .filter((item) => item.menu.parentMenuId === menu.id)
      .map((item) => item.menu.id);

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
      children: roleMenus
        .filter((item) => item.menu.level === 1)
        .map((item) => item.menu.id),
    },
    ...items,
  };
};

export const RoleMenuList = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { selectedRole } = useRoleMenuState();
  const { roleMenus } = useRoleMenuState();

  const initialCheckedItems = useMemo(() => {
    if (!roleMenus) return {};
    return roleMenus.reduce<{ [key: string]: boolean }>(
      (acc, roleMenu) => {
        if (roleMenu.isChecked) {
          acc[roleMenu.menu.id] = true;
        }
        return acc;
      },
      {},
    );
  }, [roleMenus]);

  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    initialCheckedItems,
  );

  const treeItems = useMemo<Record<TreeItemIndex, TreeItem>>(() => {
    if (!roleMenus || roleMenus.length === 0)
      return defaultTreeItems;

    return createTreeItems(roleMenus);
  }, [roleMenus]);

  const dataProvider = useMemo(() => {
    return new StaticTreeDataProvider(treeItems, (item, data) => ({
      ...item,
      data,
    }));
  }, [treeItems]);

  useEffect(() => {
    if (!roleMenus) return;

    const newChecked = { ...initialCheckedItems };

    const computeParentCheckState = (id: TreeItemIndex): boolean => {
      const item = treeItems[id];
      if (!item) return false;

      if (!item.isFolder || !item.children || item.children.length === 0) {
        return newChecked[id] || false;
      }

      let allChildrenChecked = true;
      for (const childId of item.children) {
        const childChecked = computeParentCheckState(childId);
        if (!childChecked) {
          allChildrenChecked = false;
        }
      }

      newChecked[id] = allChildrenChecked;
      return allChildrenChecked;
    };

    computeParentCheckState('root');

    setCheckedItems(newChecked);
  }, [initialCheckedItems, roleMenus, treeItems]);

  const updateDescendants = (
    id: TreeItemIndex,
    isChecked: boolean,
    items: Record<TreeItemIndex, TreeItem>,
  ): Record<string, boolean> => {
    let updates: Record<string, boolean> = {};
    const item = items[id];
    if (item && item.children && item.children.length > 0) {
      item.children.forEach((childId) => {
        updates[childId] = isChecked;
        updates = {
          ...updates,
          ...updateDescendants(childId, isChecked, items),
        };
      });
    }
    return updates;
  };

  const parentMap = useMemo<Record<string, string | null>>(() => {
    const map: Record<string, string | null> = {};
    Object.entries(treeItems).forEach(([id, item]) => {
      if (item.children?.length) {
        item.children.forEach((cid) => {
          map[String(cid)] = id;
        });
      }
      if (map[id] === undefined) map[id] = null;
    });
    return map;
  }, [treeItems]);

  const toggleCheck = (itemId: TreeItemIndex) => {
    setCheckedItems((prev) => {
      const newCheckedValue = !prev[itemId];
      const childrenUpdates = updateDescendants(
        itemId,
        newCheckedValue,
        treeItems,
      );

      let next = {
        ...prev,
        [itemId]: newCheckedValue,
        ...childrenUpdates,
      };

      let cur: string | null = String(itemId);
      while (cur && parentMap[cur] !== null) {
        const p: string = parentMap[cur]!;
        const allChildrenChecked = (treeItems[p].children ?? []).every((cid) => !!next[cid]);
        if (next[p] !== allChildrenChecked) {
          next = { ...next, [p]: allChildrenChecked };
        }
        cur = p;
      }

      return next;
    });
  };

  const updateMutation = useMutation({
    mutationFn: updateRoleMenus,
  });

  const handleSave = async () => {
    if (!selectedRole) return;
    if (updateMutation.isPending) return;

    const checkedMenuIds = Array.from(
      new Set(
        Object.entries(checkedItems)
          .filter(([, checked]) => checked)
          .flatMap(([id]) => {
            const path: string[] = [];
            let cur: string | null = String(id);
            while (cur) {
              path.push(cur);                 // 자신 추가
              cur = parentMap[cur] ?? null;   // 부모로 한 칸 올라감
            }
            return path;
          })
      )
    )
      .map((id) => Number(id))           // 숫자 ID만 남김(예: 'root', 'sub'는 NaN → 제거됨)
      .filter((n) => Number.isFinite(n))
      .sort((a, b) => a - b);

    updateMutation.mutate(
      {
        id: selectedRole?.id,
        menuIds: checkedMenuIds,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: roleQueries.roleMenuList(selectedRole?.id).queryKey,
          });
          toast.success(t('msg.common.update.success', { defaultValue: '수정이 완료되었습니다.' }));
        },
        onError: (error) => {
          console.error(error);
          toast.error(t('msg.common.update.fail', { defaultValue: '수정에 실패하였습니다.' }));
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t('col.menu.list', { defaultValue: '메뉴 목록' })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <UncontrolledTreeEnvironment
          dataProvider={dataProvider}
          getItemTitle={(item) =>
            t(item.data.messageId, { defaultValue: item.data.name })
          }
          renderItemTitle={(props) => {
            const id = String(props.item.index);
            return (
              <label
                htmlFor={`chk-${id}`}
                onClick={(e) => e.stopPropagation()}
                className="group flex w-full items-center gap-2 rounded-md px-2 py-1.5
                        text-sm
                        hover:bg-gray-50 dark:hover:bg-zinc-800/70
                        focus-within:outline-none focus-within:ring-2
                        focus-within:ring-offset-2 focus-within:ring-black
                        focus-within:ring-offset-white
                        dark:focus-within:ring-white dark:focus-within:ring-offset-zinc-900
                        transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checkedItems[props.item.index] || false}
                  onChange={() => toggleCheck(props.item.index)}
                  className="mr-1"
                />
                <span className="truncate">{props.title}</span>
              </label>
            );
          }}
          viewState={{
            ['tree']: {
              expandedItems: ['sub'],
            },
          }}
          disableMultiselect
        >
          <Tree treeId="tree" rootItem="root" />
        </UncontrolledTreeEnvironment>
      </CardContent>
      <CardFooter className="flex justify-end gap-x-4">
        <Button 
          type="button"
          onClick={handleSave}
          variant="success"
          className="flex items-center gap-2"
        >
          <CheckIcon />
          {t('btn.save', { defaultValue: '저장' })}
        </Button>
      </CardFooter>
    </Card>
  );
};
