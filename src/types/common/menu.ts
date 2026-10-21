import type { TreeItemIndex } from 'react-complex-tree';

export interface Menu {
  id: number;
  parentMenuId: number | null;
  messageId: string;
  url: string;
  name: string;
  isActive: boolean;
  isDelete: boolean;
  sortOrder: number;
  description: string | null;
  level: number;
}

export type MenuWithChildren = Menu & {
  children: MenuWithChildren[];
};

export type MenuGetRequest = Partial<Pick<Menu, 'isActive'>>;

export type MenuUpdateRequest = Omit<Menu, 'isDelete' | 'sortOrder' | 'level'>;

export interface MenuUpdatePositionRequest {
  [level: TreeItemIndex]:
    | TreeItemIndex[]
    | { [key: TreeItemIndex]: TreeItemIndex[] };
}

export type MenuCreateRequest = Pick<
  Menu,
  'parentMenuId' | 'name' | 'level' | 'isActive' | 'isDelete' | 'sortOrder'
>;
