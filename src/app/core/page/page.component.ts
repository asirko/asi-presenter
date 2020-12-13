import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { PagesState } from '../../shared/stores/pages/pages.state';
import { PagesSetCurrentChapter } from '../../shared/stores/pages/pages.actions';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent {
  readonly content = this.store.selectSnapshot(PagesState.getPageContent)(
    +this.route.snapshot.params.chapterIndex,
    +this.route.snapshot.params.pageIndex,
  );

  constructor(private route: ActivatedRoute, private store: Store) {
    this.store.dispatch(new PagesSetCurrentChapter(this.route.snapshot.params.chapterIndex));
  }
}
