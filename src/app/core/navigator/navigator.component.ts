import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { PagesState } from '../../shared/stores/pages/pages.state';
import { map, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { PagesSavePosition } from '../../shared/stores/pages/pages.actions';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe],
})
export class NavigatorComponent {
  readonly #store = inject(Store);
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly navInfo$ = this.#route.params.pipe(
    switchMap(({ chapterIndex, pageIndex }) =>
      this.#store.select(PagesState.getNavIndexes).pipe(map(fn => fn(+chapterIndex, +pageIndex))),
    ),
  );

  goTo(indexes: [number, number] | undefined): void {
    if (indexes) {
      this.#store.dispatch(new PagesSavePosition(indexes));
      this.#router.navigate(['/', this.#route.snapshot.params['course'], ...indexes], { queryParamsHandling: 'merge' });
    }
  }

  @HostListener('window:keydown', ['$event.key'])
  navWithKeyboard(key: string): void {
    const { chapterIndex, pageIndex } = this.#route.snapshot.params;
    const navInfo = this.#store.selectSnapshot(PagesState.getNavIndexes)(+chapterIndex, +pageIndex);
    switch (key) {
      case 'ArrowUp':
        this.goTo(navInfo.prevPage);
        break;
      case 'ArrowDown':
        this.goTo(navInfo.nextPage);
        break;
      case 'ArrowLeft':
        this.goTo(navInfo.prevChapter);
        break;
      case 'ArrowRight':
        this.goTo(navInfo.nextChapter);
        break;
    }
  }
}
