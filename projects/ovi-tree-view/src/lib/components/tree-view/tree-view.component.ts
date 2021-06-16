import { Component, Input, OnInit } from "@angular/core";
import { TreeItem } from "../../models";
import { TreeItemService } from "../../services";

@Component({
  selector: 'ovi-tree-view',
  template: '<ovi-tree-item *ngFor="let item of items" [item]="item"></ovi-tree-item>',
  host: { 'role': 'tree' }
})
export class OviTreeViewComponent implements OnInit {
  @Input() public items: TreeItem[] = [];

  constructor(private service: TreeItemService) {}

  ngOnInit() {
    this.service.buildState(this.items);
    this.service.focusItem(this.items[0]);
  }
}
