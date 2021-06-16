import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { TreeItem } from '../../models';
import { TreeItemService } from '../../services';

@Component({
  selector: 'ovi-tree-item',
  templateUrl: './tree-item.component.html',
  host: { role: 'tree-item' },
  styles: [':host { display: block }']
})
export class OviTreeItemComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public expanded = false;
  @Input() public item!: TreeItem;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private service: TreeItemService
  ) {}

  ngOnInit() {
    if (this.item.items.length) {
      this.subscriptions.push(
        this.service.expandedItems$
          .pipe(map((items) => items.find((i) => i.key === this.item.key)))
          .subscribe((i) => {
            if (i && i.key) {
              this.expanded = true;
              this.renderer.setAttribute(
                this.el.nativeElement,
                'expanded',
                'true',
                'aria'
              );
            } else {
              this.expanded = false;
              this.renderer.setAttribute(
                this.el.nativeElement,
                'expanded',
                'true',
                'aria'
              );
            }
          })
      );
    }
    this.subscriptions.push(
      this.service.focusedItem$.subscribe((i) => {
        if (i && i.key === this.item.key) {
          this.renderer.setAttribute(this.el.nativeElement, 'tabindex', '0');
          this.el.nativeElement.focus();
        } else {
          this.renderer.setAttribute(this.el.nativeElement, 'tabindex', '-1');
        }
      })
    );
    this.subscriptions.push(
      this.service.selectedItem$.subscribe((i) => {
        if (i && i.key === this.item.key) {
          this.renderer.setAttribute(
            this.el.nativeElement,
            'selected',
            'true',
            'aria'
          );
        } else {
          this.renderer.setAttribute(
            this.el.nativeElement,
            'selected',
            'false',
            'aria'
          );
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.filter((sub) => sub).forEach((sub) => sub.unsubscribe());
  }
}
