import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { PagesInit } from '../../shared/stores/pages/pages.actions';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { PagesState } from '../../shared/stores/pages/pages.state';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
  readonly mainTitle$ = this.store.select(PagesState.getMainTitle);
  readonly author$ = this.store.select(PagesState.getAuthor);
  readonly email$ = this.store.select(PagesState.getEmail);
  readonly chapterTitle$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => this.route.firstChild.snapshot.params.chapterIndex),
    switchMap((chapterIndex) =>
      this.store.select(PagesState.getChapterTitle).pipe(map((filterFn) => filterFn(chapterIndex))),
    ),
  );

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.store
      .dispatch(new PagesInit())
      .pipe(first())
      .subscribe(() => this.title.setTitle(this.store.selectSnapshot(PagesState.getMainTitle)));
  }
}
