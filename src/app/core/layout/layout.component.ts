import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { PagesState } from '../../shared/stores/pages/pages.state';
import { Title } from '@angular/platform-browser';
import { slideInAnimation } from './layout.animation';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInAnimation],
})
export class LayoutComponent implements OnInit {
  readonly mainTitle = this.store.selectSnapshot(PagesState.getMainTitle);
  readonly author = this.store.selectSnapshot(PagesState.getAuthor);
  readonly email = this.store.selectSnapshot(PagesState.getEmail);
  readonly chapterTitle$ = this.store.select(PagesState.getChapterTitle);
  readonly chapterProgression$ = this.store.select(PagesState.getChapterProgression);
  readonly mainProgression$ = this.store.select(PagesState.getMainProgression);

  private previousRouteParams: { chapterIndex: number; pageIndex: number };

  constructor(private store: Store, private router: Router, private route: ActivatedRoute, private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle(this.store.selectSnapshot(PagesState.getMainTitle));
  }

  prepareRoute(outlet: RouterOutlet): string {
    if (!outlet.isActivated) {
      return;
    }
    const nextRoute = {
      pageIndex: +outlet.activatedRoute.snapshot.params.pageIndex,
      chapterIndex: +outlet.activatedRoute.snapshot.params.chapterIndex,
    };

    let transition = '';
    if (this.previousRouteParams && this.previousRouteParams.chapterIndex < nextRoute.chapterIndex) {
      transition = 'right-to-left';
    } else if (this.previousRouteParams && this.previousRouteParams.chapterIndex > nextRoute.chapterIndex) {
      transition = 'left-to-right';
    } else if (this.previousRouteParams && this.previousRouteParams.pageIndex < nextRoute.pageIndex) {
      transition = 'bottom-to-top';
    } else if (this.previousRouteParams && this.previousRouteParams.pageIndex > nextRoute.pageIndex) {
      transition = 'top-to-bottom';
    }
    // https://angular.io/guide/route-animations
    this.previousRouteParams = nextRoute;
    return transition;
  }
}
