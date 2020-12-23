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
  readonly logos = this.store.selectSnapshot(PagesState.getLogos);
  readonly chapterTitle$ = this.store.select(PagesState.getChapterTitle);
  readonly chapterProgression$ = this.store.select(PagesState.getChapterProgression);
  readonly mainProgression$ = this.store.select(PagesState.getMainProgression);

  private previousRouteParams: { chapterIndex: number; pageIndex: number };
  private previousTransition: string;

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
      transition = this.previousTransition === 'right-to-left' ? 'right-to-left-2' : 'right-to-left';
    } else if (this.previousRouteParams && this.previousRouteParams.chapterIndex > nextRoute.chapterIndex) {
      transition = this.previousTransition === 'left-to-right' ? 'left-to-right-2' : 'left-to-right';
    } else if (this.previousRouteParams && this.previousRouteParams.pageIndex < nextRoute.pageIndex) {
      transition = this.previousTransition === 'bottom-to-top' ? 'bottom-to-top-2' : 'bottom-to-top';
    } else if (this.previousRouteParams && this.previousRouteParams.pageIndex > nextRoute.pageIndex) {
      transition = this.previousTransition === 'top-to-bottom' ? 'top-to-bottom-2' : 'top-to-bottom';
    }
    // https://angular.io/guide/route-animations
    this.previousRouteParams = nextRoute;
    this.previousTransition = transition;
    return transition;
  }
}
