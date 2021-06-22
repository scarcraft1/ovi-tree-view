import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { TreeItem } from '../../models';
import { TreeItemService } from '../../services';

@Component({
  selector: 'ovi-tree-item',
  templateUrl: './tree-item.component.html',
  host: { role: 'tree-item' },
  styleUrls: ['./tree-item.component.css'],
})
export class OviTreeItemComponent<T extends TreeItem> implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public expanded = false;
  @Input() public item!: T;
  @Input() public template?: TemplateRef<any>;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private service: TreeItemService
  ) { }

  public toggle(): void {
    if (this.expanded) {
      this.service.collapseItem(this.item);
    } else {
      this.service.expandItem(this.item);
    }
    this.service.focusItem(this.item);
  }

  public select(): void {
    if (this.expanded) {
      this.service.collapseItem(this.item);
    } else {
      this.service.expandItem(this.item);
    }
    this.service.selectItem(this.item);
  }

  @HostListener('focus', ['$event'])
  private onFocus($event: FocusEvent) {
    this.service.focusItem(this.item);
    $event.stopImmediatePropagation();
  }

  @HostListener('keyup', ['$event'])
  private onKeyUp($event: KeyboardEvent) {
    switch ($event.key) {
      case 'ArrowUp':
        this.service.moveFocus = true;
        this.service.focusPreviousItem(this.item);
        $event.stopImmediatePropagation();
        break;
      case 'ArrowRight':
        if (this.expanded) {
          if (this.item.items.length) {
            this.service.moveFocus = true;
            this.service.focusNextItem(this.item);
          }
        } else {
          this.service.expandItem(this.item);
        }
        $event.stopImmediatePropagation();
        break;
      case 'ArrowDown':
        this.service.moveFocus = true;
        this.service.focusNextItem(this.item);
        $event.stopImmediatePropagation();
        break;
      case 'ArrowLeft':
        if (this.expanded) {
          this.service.collapseItem(this.item);
        } else {
          this.service.moveFocus = true;
          this.service.focusParent(this.item);
        }
        $event.stopImmediatePropagation();
        break;
      case 'Home':
        this.service.moveFocus = true;
        this.service.focusFirstFocusableNode();
        $event.stopImmediatePropagation();
        break;
      case 'End':
        this.service.moveFocus = true;
        this.service.focusLastFocusableNode();
        $event.stopImmediatePropagation();
        break;
      case '*':
        this.service.expandAllSiblings(this.item);
        $event.stopImmediatePropagation();
        break;
      case 'Enter':
      case ' ':
        this.service.selectItem(this.item);
        $event.stopImmediatePropagation();
        break;
      default:
        if (new RegExp('^[a-zñ]$', 'i').test($event.key)) {
          this.service.moveFocus = true;
          this.service.searchItem($event.key);
          $event.stopImmediatePropagation();
        }
        break;
    }
  }

  ngOnInit() {
    if (this.item.items.length) {
      this.subscriptions.push(
        this.service.expandedItems$
          .pipe(map((items) => items.find((i) => i.key === this.item.key)))
          .subscribe((i) => {
            if (i && i.key) {
              this.expanded = true;
              this.renderer.setAttribute(this.el.nativeElement, 'aria-expanded', 'true');
            } else {
              this.expanded = false;
              this.renderer.setAttribute(this.el.nativeElement, 'aria-expanded', 'false');
            }
          })
      );
    }
    this.subscriptions.push(
      this.service.focusedItem$.subscribe((i) => {
        if (i && i.key === this.item.key) {
          this.renderer.setAttribute(this.el.nativeElement, 'tabindex', '0');
          if (this.service.moveFocus) {
            this.el.nativeElement.focus();
            this.service.moveFocus = false;
          }
        } else {
          this.renderer.setAttribute(this.el.nativeElement, 'tabindex', '-1');
        }
      })
    );
    this.subscriptions.push(
      this.service.selectedItem$.subscribe((i) => {
        if (i && i.key === this.item.key) {
          this.renderer.setAttribute(this.el.nativeElement, 'aria-selected', 'true');
        } else {
          this.renderer.setAttribute(this.el.nativeElement, 'aria-selected', 'false');
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.filter((sub) => sub).forEach((sub) => sub.unsubscribe());
  }
}
