import { TreeItem } from '../models/tree-item';

export function CreateTreeItem(parentKey: string = '', level = 0): TreeItem {
  const ID = (parentKey ? parentKey + '-' : '') + Math.floor(Math.random() * 10).toString();
  const NAME = Array.from(new Array(Math.floor(Math.random() * 223) + 3), () => Math.random() < .15 ? ' ' : String.fromCharCode(Math.floor(Math.random() * 26) + 65)).join('');
  const CHILDREN = level === 4 ? [] : Array.from(new Array(Math.floor(Math.random() * 5)), () => CreateTreeItem(ID, level + 1));
  const CARATULA = Math.random() > .54;
  const ARCHIVO = !CHILDREN.length ? Array.from(new Array(Math.floor(Math.random() * 223) + 3), () => Math.random() < .15 ? ' ' : String.fromCharCode(Math.floor(Math.random() * 26) + 65)).join('') + '.pdf' : undefined;
  return {
    key: ID,
    name: NAME,
    items: CHILDREN,
    caratula: CARATULA,
    archivo: ARCHIVO
  };
}
