import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { COMPONENTS, OviTreeItemDirective, PUBLIC_COMPONENTS } from './components';

@NgModule({
  declarations: [...COMPONENTS, OviTreeItemDirective],
  imports: [CommonModule],
  exports: [...PUBLIC_COMPONENTS, OviTreeItemDirective],
})
export class OviTreeViewModule { }
