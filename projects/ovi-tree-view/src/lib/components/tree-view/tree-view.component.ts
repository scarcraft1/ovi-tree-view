import { Component, ContentChild, Input, OnInit, TemplateRef } from "@angular/core";
import { TreeItem } from "../../models";
import { TreeItemService } from "../../services";
import { OviTreeItemDirective } from '../tree-item.directive';

@Component({
  selector: 'ovi-tree-view',
  template: `
    <ng-content select="[oviTreeItem]"></ng-content>
    <ovi-tree-item *ngFor="let item of items" [item]="item" [template]="template"></ovi-tree-item>`,
  host: { 'role': 'tree' },
  styles: ['{ display: block; }']
})
export class OviTreeViewComponent<T extends TreeItem> implements OnInit {
  @Input() public items: T[] = [];
  @ContentChild(OviTreeItemDirective, { read: TemplateRef }) public template!: TemplateRef<any>;

  constructor(private service: TreeItemService) { }

  ngOnInit() {
    this.service.buildState(this.items);
  }
}
