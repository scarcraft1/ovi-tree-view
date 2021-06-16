import { TreeItem } from '../models';

export function HasChild(item: TreeItem, searchItem: TreeItem): boolean {
  return item.items.reduce(
    (acc: boolean, i: TreeItem) =>
      acc ? acc : i.key === searchItem.key || HasChild(i, searchItem),
    false
  );
}
