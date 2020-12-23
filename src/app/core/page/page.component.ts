import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { PagesState } from '../../shared/stores/pages/pages.state';
import { PagesSetCurrentIndexes } from '../../shared/stores/pages/pages.actions';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent {
  private readonly chapterIndex = +this.route.snapshot.params.chapterIndex;
  private readonly pageIndex = +this.route.snapshot.params.pageIndex;

  readonly content = this.store.selectSnapshot(PagesState.getPageContent)(this.chapterIndex, this.pageIndex);

  constructor(private route: ActivatedRoute, private store: Store) {
    this.store.dispatch(new PagesSetCurrentIndexes(this.chapterIndex, this.pageIndex));
  }
}
