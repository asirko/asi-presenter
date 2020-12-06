import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { PagesState } from '../../shared/stores/pages/pages.state';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent {
  content$ = this.route.params.pipe(
    switchMap(({ chapterIndex, pageIndex }) =>
      this.store.select(PagesState.getPageContent).pipe(map((fn) => fn(chapterIndex, pageIndex))),
    ),
  );

  constructor(private route: ActivatedRoute, private store: Store) {}
}
