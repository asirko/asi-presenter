import { APP_INITIALIZER, NgModule, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule, Store } from '@ngxs/store';
import { PagesState } from '../shared/stores/pages/pages.state';
import { environment } from '../../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { PageComponent } from './page/page.component';
import { MarkdownModule } from 'ngx-markdown';
import { NavigatorComponent } from './navigator/navigator.component';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';
import { CoreInitializer } from './core.initializer';

@NgModule({
  declarations: [LayoutComponent, PageComponent, NavigatorComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    CoreRoutingModule,
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE,
    }),
    NgxsModule.forRoot([PagesState], {
      developmentMode: !environment.production,
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (coreInitializer: CoreInitializer) => () => coreInitializer.resolve(),
      deps: [CoreInitializer],
      multi: true,
    },
  ],
  bootstrap: [LayoutComponent],
})
export class CoreModule {}
