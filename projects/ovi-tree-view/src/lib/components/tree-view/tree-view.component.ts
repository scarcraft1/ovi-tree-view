import { Component, ContentChild, forwardRef, Input, OnDestroy, OnInit, TemplateRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TreeItem } from "../../models";
import { TreeItemService } from "../../services";
import { OviTreeItemDirective } from '../tree-item.directive';

@Component({
  selector: 'ovi-tree-view',
  template: `
    <ng-content select="[oviTreeItem]"></ng-content>
    <ovi-tree-item *ngFor="let item of items$ | async" [item]="item" [template]="template"></ovi-tree-item>`,
  host: { 'role': 'tree' },
  styles: ['{ display: block; }'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OviTreeViewComponent),
    multi: true
  }]
})
export class OviTreeViewComponent<T extends TreeItem> implements OnInit, OnDestroy, ControlValueAccessor {
  private subscriptions: Subscription[] = [];
  private isDisabled: boolean = false;

  @ContentChild(OviTreeItemDirective, { read: TemplateRef })
  public template!: TemplateRef<any>;

  public get items$() {
    return this.service.items$;
  }
  @Input()
  public set items(items: T[]) {
    this.service.buildState(items || []);
  }

  public onChange: any = () => { };
  public onTouched: any = () => { };

  constructor(private service: TreeItemService) { }

  writeValue(item: T): void {
    if (item) {
      this.service.selectItem(item);
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }

  ngOnInit() {
    this.subscriptions.push(this.service.selectedItem$
      .pipe(filter(() => !this.isDisabled))
      .subscribe(value => {
        this.onChange(value);
        this.onTouched();
      }));
  }

  ngOnDestroy() {
    this.subscriptions.filter(sub => sub).forEach(sub => sub.unsubscribe());
  }
}
