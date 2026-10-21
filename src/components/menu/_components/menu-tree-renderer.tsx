/* eslint-disable @typescript-eslint/no-explicit-any */

import { PlusIcon } from 'lucide-react';
import type { AllTreeRenderProps, TreeItem } from 'react-complex-tree';

import { Button } from '@/components/ui/button.tsx';
import type { Menu } from '@/types/common/menu.ts';

const cx = (...classNames: Array<string | undefined | false>) =>
  classNames.filter((cn) => !!cn).join(' ');

export const menuTreeRenderer = ({
  renderDepthOffset = 10,
  onOpenMenuDialog,
}: {
  renderDepthOffset?: number;
  onOpenMenuDialog: (item: TreeItem<Menu>) => void;
}): Pick<AllTreeRenderProps, 'renderItem'> => {
  return {
    renderItem: ({ item, depth, children, title, context, arrow }) => {
      return (
        <li
          {...(context.itemContainerWithChildrenProps as any)}
          className={cx(
            'rct-tree-item-li',
            item.isFolder && 'rct-tree-item-li-isFolder',
            context.isSelected && 'rct-tree-item-li-selected',
            context.isExpanded && 'rct-tree-item-li-expanded',
            context.isFocused && 'rct-tree-item-li-focused',
            context.isDraggingOver && 'rct-tree-item-li-dragging-over',
            context.isSearchMatching && 'rct-tree-item-li-search-match',
          )}
        >
          <div
            {...(context.itemContainerWithoutChildrenProps as any)}
            style={{ '--depthOffset': `${(depth + 1) * renderDepthOffset}px` }}
            className={cx(
              'rct-tree-item-title-container',
              item.isFolder && 'rct-tree-item-title-container-isFolder',
              context.isSelected && 'rct-tree-item-title-container-selected',
              context.isExpanded && 'rct-tree-item-title-container-expanded',
              context.isFocused && 'rct-tree-item-title-container-focused',
              context.isDraggingOver && 'rct-tree-item-title-container-dragging-over',
              context.isSearchMatching && 'rct-tree-item-title-container-search-match',
            )}
          >
            {arrow}
            <div
              {...(context.interactiveElementProps as any)}
              className={cx(
                'rct-tree-item-button',
                item.isFolder && 'rct-tree-item-button-isFolder',
                context.isSelected && 'rct-tree-item-button-selected',
                context.isExpanded && 'rct-tree-item-button-expanded',
                context.isFocused && 'rct-tree-item-button-focused',
                context.isDraggingOver && 'rct-tree-item-button-dragging-over',
                context.isSearchMatching && 'rct-tree-item-button-search-match',
              )}
            >
              <button className="pointer-events-none">{title}</button>
              {(item.data.level === undefined || item.data.level < 3) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-[4px] top-1/2 size-[24px] -translate-y-1/2 hover:bg-gray-200"
                  onClick={(evt) => {
                    evt.stopPropagation();
                    onOpenMenuDialog(item);
                  }}
                >
                  <PlusIcon />
                </Button>
              )}
            </div>
          </div>
          {children}
        </li>
      );
    },
  };
};
