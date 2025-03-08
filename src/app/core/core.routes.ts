import { Routes } from '@angular/router';
import { PageComponent } from './page/page.component';

export const routes: Routes = [
  {
    pathMatch: 'full',
    path: '',
    redirectTo: '0/0',
  },
  {
    path: ':chapterIndex/:pageIndex',
    component: PageComponent,
  },
];
