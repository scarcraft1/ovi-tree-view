import { Component } from '@angular/core';
import { OviTreeItem } from 'ovi-tree-view';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'tree-view-demo';

  items: OviTreeItem[] = [
    {
      key: 1,
      name: 'Tomo 1',
      items: [
        {
          key: 11,
          name: 'Libro 1',
          items: [
            {
              key: 111,
              name: 'Sección 1',
              items: [],
            },
            {
              key: 112,
              name: 'Sección 2',
              items: [],
            },
          ],
        },
        {
          key: 12,
          name: 'Libro 2',
          items: [
            {
              key: 121,
              name: 'Seccion 1',
              items: [],
            },
          ],
        },
      ],
    },
    {
      key: 2,
      name: 'Tomo 2',
      items: [
        {
          key: 21,
          name: 'Libro 1',
          items: [],
        },
      ],
    },
  ];
}
