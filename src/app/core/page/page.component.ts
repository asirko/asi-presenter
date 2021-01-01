import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
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
export class PageComponent implements OnInit, OnDestroy {
  private readonly chapterIndex = +this.route.snapshot.params.chapterIndex;
  private readonly pageIndex = +this.route.snapshot.params.pageIndex;

  readonly content = this.store.selectSnapshot(PagesState.getPageContent)(this.chapterIndex, this.pageIndex);

  private unListen: () => void;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {
    this.store.dispatch(new PagesSetCurrentIndexes(this.chapterIndex, this.pageIndex));
  }

  ngOnInit(): void {
    this.unListen = this.renderer.listen(document.body, 'copy', (event: CustomEvent) => {
      navigator.clipboard.writeText(event.detail);
    });
  }

  ngOnDestroy(): void {
    this.unListen();
  }
}
