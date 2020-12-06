import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageComponent } from './page/page.component';

const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
