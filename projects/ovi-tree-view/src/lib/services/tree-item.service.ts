import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TreeItem } from '../models';
import { BuildFocusableTree, GetParent, GetTopParent } from '../utils';

@Injectable({ providedIn: 'root' })
export class TreeItemService {
  private _items: TreeItem[] = [];
  private _focusableItems: TreeItem[] = [];
  private _expandedItems = new BehaviorSubject<TreeItem[]>([]);
  private _focusedItem = new BehaviorSubject<TreeItem | null>(null);
  private _selectedItem = new BehaviorSubject<TreeItem | null>(null);
  private _searchTerm: string = '';
  private _clearSearchTimeout: any;

  public moveFocus = false;

  public get expandedItems$() {
    return this._expandedItems.asObservable();
  }
  public get focusedItem$() {
    return this._focusedItem.asObservable();
  }
  public get selectedItem$() {
    return this._selectedItem.asObservable();
  }

  public buildState(items: TreeItem[], selectedItem?: TreeItem) {
    this._items = items;
    this._expandedItems.next([]);
    this._focusableItems = this._items;
    this.selectItem(selectedItem || items[0]);
  }

  public expandItem(item: TreeItem): void {
    const expandedItems = this._expandedItems
      .getValue()
      .filter((i) => i.key !== item.key)
      .concat(item);
    this._expandedItems.next(expandedItems);
    this._focusableItems = BuildFocusableTree(this._items, expandedItems);
  }

  public collapseItem(item: TreeItem): void {
    const expandedItems = this._expandedItems.getValue().filter((i) => i.key !== item.key);
    this._expandedItems.next(expandedItems);
    this._focusableItems = BuildFocusableTree(this._items, expandedItems);
  }

  public searchItem(searchTerm: string, debounceTime: number = 500): void {
    const focusedItem = this._focusedItem.getValue();
    if (!focusedItem) {
      return;
    }

    clearTimeout(this._clearSearchTimeout);
    this._searchTerm += searchTerm;
    this._clearSearchTimeout = setTimeout(() => {
      const idx = this._focusableItems.findIndex((i) => i.key === focusedItem.key) || 0;
      const nextItem = this._focusableItems
        .slice(idx)
        .concat(this._focusableItems.slice(0, idx))
        .slice(1)
        .find((i) => i.name.toLowerCase().startsWith(this._searchTerm.toLowerCase()));
      if (nextItem) {
        this._focusedItem.next(nextItem);
      }
      this._searchTerm = '';
    }, debounceTime);
  }

  public expandAllSiblings(item: TreeItem): void {
    const parent = GetParent(this._items, item);
    const itemsToExpand = parent ? parent.items : this._items;
    itemsToExpand.forEach((i) => this.expandItem(i));
  }

  public focusItem(item: TreeItem) {
    if (this._focusableItems.some((i) => i.key === item.key)) {
      this._focusedItem.next(item);
    }
  }

  public focusParent(item: TreeItem) {
    const parent = GetParent(this._items, item);
    if (parent) {
      this.focusItem(parent);
    }
  }

  public focusFirstFocusableNode() {
    if (this._focusableItems.length) {
      this._focusedItem.next(this._focusableItems[0]);
    }
  }

  public focusLastFocusableNode() {
    if (this._focusableItems.length) {
      this._focusedItem.next(this._focusableItems.slice(-1)[0]);
    }
  }

  public focusNextItem(item: TreeItem): void {
    const idx = this._focusableItems.findIndex((i) => i.key === item.key);
    if (idx < this._focusableItems.length - 1) {
      this._focusedItem.next(this._focusableItems[idx + 1]);
    }
  }

  public focusPreviousItem(item: TreeItem): void {
    const idx = this._focusableItems.findIndex((i) => i.key === item.key);
    if (idx > 0) {
      this._focusedItem.next(this._focusableItems[idx - 1]);
    }
  }

  public selectItem(item: TreeItem) {
    if (this._focusedItem.getValue()?.key === item.key) {
      this._selectedItem.next(item);
    } else {
      let tree = this._items;
      while (this._focusedItem.getValue()?.key !== item.key) {
        if (this._focusableItems.some((f) => f.key === item.key)) {
          this._selectedItem.next(item);
          this._focusedItem.next(item);
        } else {
          let parent = GetTopParent(tree, item);
          if (parent && !this._expandedItems.getValue().some((i) => i.key === parent?.key)) {
            this._expandedItems.next(this._expandedItems.getValue().concat(parent));
            this._focusableItems = BuildFocusableTree(this._items, this._expandedItems.getValue());
          } else if (!parent) {
            break;
          }
          tree = parent.items;
        }
      }
    }
  }
}
