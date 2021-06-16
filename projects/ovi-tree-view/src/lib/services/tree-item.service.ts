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

  public get expandedItems$() {
    return this._expandedItems.asObservable();
  }
  public get focusedItem$() {
    return this._focusedItem.asObservable();
  }
  public get selectedItem$() {
    return this._selectedItem.asObservable();
  }

  public buildState(items: TreeItem[]) {
    this._items = items;
    this._expandedItems.next([]);
    this._focusableItems = BuildFocusableTree(
      this._items,
      this._expandedItems.getValue()
    );
    this._focusedItem.next(null);
  }

  public expandFocusedItem(): void {
    const focusedItem = this._focusedItem.getValue();
    if (focusedItem) {
      this._expandedItems.next(
        this._expandedItems
          .getValue()
          .filter((e) => e.key !== focusedItem.key)
          .concat(focusedItem)
      );
      this._focusableItems = BuildFocusableTree(
        this._items,
        this._expandedItems.getValue()
      );
    }
  }

  public expandAllFocusedItemSiblings(): void {
    const focusedItem = this._focusedItem.getValue();
    if (focusedItem) {
      const parent = GetParent(this._items, focusedItem);
      if (parent) {
        this._expandedItems.next(
          this._expandedItems
            .getValue()
            .filter((e) => parent.items.every((c) => c.key !== e.key))
            .concat(parent.items)
        );
        this._focusableItems = BuildFocusableTree(
          this._items,
          this._expandedItems.getValue()
        );
      }
    }
  }

  public collapseFocusedItem(): void {
    const focusedItem = this._focusedItem.getValue();
    if (focusedItem) {
      this._expandedItems.next(
        this._expandedItems.getValue().filter((e) => e.key !== focusedItem.key)
      );
      this._focusableItems = BuildFocusableTree(
        this._items,
        this._expandedItems.getValue()
      );
    }
  }

  public focusItem(item: TreeItem) {
    if (this._focusableItems.some((i) => i.key === item.key)) {
      this._focusedItem.next(item);
    }
  }

  public focusNextItem(): void {
    const focusedItem = this._focusedItem.getValue();
    if (focusedItem) {
      const idx = this._focusableItems.findIndex(
        (i) => i.key === focusedItem.key
      );
      this._focusedItem.next(this._focusableItems[idx + 1]);
    }
  }

  public focusPreviousItem(): void {
    const focusedItem = this._focusedItem.getValue();
    if (focusedItem) {
      const idx = this._focusableItems.findIndex(
        (i) => i.key === focusedItem.key
      );
      this._focusedItem.next(this._focusableItems[idx - 1]);
    }
  }

  public selectItem(item: TreeItem) {
    let tree = this._items;
    while (this._focusedItem.getValue()?.key !== item.key) {
      if (this._focusableItems.some((f) => f.key === item.key)) {
        this._selectedItem.next(item);
        this._focusedItem.next(item);
      } else {
        let parent = GetTopParent(tree, item);
        if (
          parent &&
          !this._expandedItems.getValue().some((i) => i.key === parent?.key)
        ) {
          this._expandedItems.next(
            this._expandedItems.getValue().concat(parent)
          );
          this._focusableItems = BuildFocusableTree(
            this._items,
            this._expandedItems.getValue()
          );
        } else if (!parent) {
          break;
        }
        tree = parent.items;
      }
    }
  }
}
