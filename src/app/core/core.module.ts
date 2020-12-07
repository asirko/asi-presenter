import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { PagesState } from '../shared/stores/pages/pages.state';
import { environment } from '../../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { PageComponent } from './page/page.component';
import { MarkdownModule } from 'ngx-markdown';
import { NavigatorComponent } from './navigator/navigator.component';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

@NgModule({
  declarations: [LayoutComponent, PageComponent, NavigatorComponent],
  imports: [
    BrowserModule,
    CommonModule,
    CoreRoutingModule,
    HttpClientModule,
    MarkdownModule.forRoot(),
    NgxsModule.forRoot([PagesState], {
      developmentMode: !environment.production,
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
  ],
  bootstrap: [LayoutComponent],
})
export class CoreModule {}
