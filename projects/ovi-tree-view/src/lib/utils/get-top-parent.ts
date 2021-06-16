import { TreeItem } from '../models';
import { HasChild } from './has-child';

export function GetTopParent(
  tree: TreeItem[],
  target: TreeItem
): TreeItem | undefined {
  return tree.find((i) => HasChild(i, target));
}
