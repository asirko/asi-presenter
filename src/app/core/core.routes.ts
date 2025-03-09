import { Routes } from '@angular/router';
import { PageComponent } from './page/page.component';

export const DEFAULT_COURSE = 'esgi-angular';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: `${DEFAULT_COURSE}/0/0`,
  },
  {
    path: ':course/:chapterIndex/:pageIndex',
    component: PageComponent,
  },
];
