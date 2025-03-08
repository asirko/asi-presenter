import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { PagesState } from '../../shared/stores/pages/pages.state';
import { PagesSetCurrentIndexes } from '../../shared/stores/pages/pages.actions';
import { MarkdownComponent } from 'ngx-markdown';
import { NavigatorComponent } from '../navigator/navigator.component';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MarkdownComponent, NavigatorComponent],
})
export class PageComponent {
  readonly #route = inject(ActivatedRoute);
  readonly #store = inject(Store);

  private readonly chapterIndex = +this.#route.snapshot.params['chapterIndex'];
  private readonly pageIndex = +this.#route.snapshot.params['pageIndex'];

  readonly content = this.#store.selectSnapshot(PagesState.getPageContent)(this.chapterIndex, this.pageIndex);

  constructor() {
    this.#store.dispatch(new PagesSetCurrentIndexes(this.chapterIndex, this.pageIndex));
  }
}
