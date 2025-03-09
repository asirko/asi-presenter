import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
  SecurityContext,
} from '@angular/core';
import { provideRouter, RouteReuseStrategy } from '@angular/router';

import { DEFAULT_COURSE, routes } from './core.routes';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import { provideStore, Store } from '@ngxs/store';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { firstValueFrom } from 'rxjs';
import { PagesInit } from '../shared/stores/pages/pages.actions';
import { PagesState } from '../shared/stores/pages/pages.state';
import { provideHttpClient } from '@angular/common/http';
import { MARKED_OPTIONS, provideMarkdown } from 'ngx-markdown';
import { markedOptionsFactory } from '../shared/conf/MarkedOptions';
import { environment } from '../../environments/environment';
import { NoRouteReuseStrategy } from './no-route-reuse-strategy';

console.log(environment);

export const coreConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideStore(
      [PagesState],
      withNgxsReduxDevtoolsPlugin(),
      withNgxsLoggerPlugin({ disabled: environment.production }),
    ),
    provideAnimationsAsync(),
    provideAppInitializer(async () => {
      const store = inject(Store);
      const course = new URL(window.location.href).pathname.split('/')[2];
      await firstValueFrom(store.dispatch(new PagesInit(course || DEFAULT_COURSE)));
    }),
    provideMarkdown({
      sanitize: SecurityContext.NONE,
      markedOptions: {
        provide: MARKED_OPTIONS,
        useFactory: store => markedOptionsFactory(store),
        deps: [Store],
      },
    }),
    {
      provide: RouteReuseStrategy,
      useClass: NoRouteReuseStrategy,
    },
  ],
};
