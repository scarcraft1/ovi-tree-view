import { Component } from '@angular/core';
import { OviTreeItem } from 'ovi-tree-view';
import { TreeItem } from './models/tree-item';
import { CreateTreeItem } from './utils/create-tree-item';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tree-view-demo';

  public selectedItem?: TreeItem;

  items: OviTreeItem[] = Array.from(new Array(Math.floor(Math.random() * 2) + 1), () => CreateTreeItem());
}
