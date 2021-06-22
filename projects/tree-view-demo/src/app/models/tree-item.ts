import { OviTreeItem } from 'ovi-tree-view';

export interface TreeItem extends OviTreeItem {
  caratula: boolean;
  archivo?: string;
}
