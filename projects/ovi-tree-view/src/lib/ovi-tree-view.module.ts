import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { COMPONENTS, PUBLIC_COMPONENTS } from './components';

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule],
  exports: [...PUBLIC_COMPONENTS],
})
export class OviTreeViewModule {}
