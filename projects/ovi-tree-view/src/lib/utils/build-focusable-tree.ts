import { TreeItem } from '../models';

export function BuildFocusableTree(
  items: TreeItem[],
  expandedItems: TreeItem[]
): TreeItem[] {
  return items.reduce(
    (acc: TreeItem[], i: TreeItem) =>
      acc
        .concat(i)
        .concat(
          expandedItems.some((e) => e.key === i.key)
            ? BuildFocusableTree(i.items, expandedItems)
            : []
        ),
    []
  );
}
