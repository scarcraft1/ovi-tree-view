import { TreeItem } from '../models';

export function GetParent(
  tree: TreeItem[],
  item: TreeItem
): TreeItem | undefined {
  return tree.reduce(
    (acc: TreeItem | undefined, i: TreeItem) =>
      acc
        ? acc
        : i.items.some((c) => c.key === item.key)
        ? i
        : GetParent(i.items, item),
    undefined
  );
}
