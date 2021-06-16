import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OviTreeViewModule } from 'ovi-tree-view';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    OviTreeViewModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
