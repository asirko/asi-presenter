import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { NgxsModule, Store } from '@ngxs/store';
import { PagesState } from '../stores/pages/pages.state';

export function parsedSrc(baseUrl: string, course: string): string {
  return baseUrl.replace('~', `./assets/courses/${course}`);
}

@Pipe({
  name: 'src',
})
export class SrcPipe implements PipeTransform {
  constructor(private store: Store) {}

  transform(value: string): string {
    const course = this.store.selectSnapshot(PagesState.getCourse);
    return parsedSrc(value, course);
  }
}

@NgModule({
  declarations: [SrcPipe],
  exports: [SrcPipe],
  imports: [NgxsModule],
})
export class SrcPipeModule {}
