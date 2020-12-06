import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { PagesInit, PagesRetrievePage } from './pages.actions';
import { PagesStateModel } from './pages.model';
import { Observable } from 'rxjs';
import { PagesService } from './pages.service';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { patch, updateItem } from '@ngxs/store/operators';

@State<PagesStateModel>({
  name: 'pages',
  defaults: null,
})
@Injectable()
export class PagesState {
  @Selector()
  static state(state: PagesStateModel): PagesStateModel {
    return state;
  }
  @Selector()
  static getAuthor(state: PagesStateModel): string {
    return state?.author;
  }
  @Selector()
  static getEmail(state: PagesStateModel): string {
    return state?.email;
  }
  @Selector()
  static getMainTitle(state: PagesStateModel): string {
    return state?.title;
  }

  @Selector()
  static getChapterTitle(state: PagesStateModel): (index: number) => string {
    return (index: number) => state?.chapters[index].title;
  }

  @Selector()
  static getPageContent(state: PagesStateModel): (chapterIndex: number, pageIndex: number) => string {
    return (chapterIndex: number, pageIndex: number) => {
      if (!state?.chapters[chapterIndex] || !state?.chapters[chapterIndex].pages[pageIndex]) {
        return 'slide is not define in summary';
      }
      return state?.chapters[chapterIndex].pages[pageIndex].content;
    };
  }

  constructor(private pagesService: PagesService, private store: Store) {}

  @Action(PagesInit)
  public init(ctx: StateContext<PagesStateModel>): Observable<any> {
    return this.pagesService.getSummary$('./assets/summary.json').pipe(
      tap((summary: PagesStateModel) => {
        ctx.setState(summary);
        // retrieve all contents once the summary is retrieved
        summary.chapters.forEach((c, ci) =>
          c.pages.forEach((p, pi) => this.store.dispatch(new PagesRetrievePage(ci, pi))),
        );
      }),
    );
  }

  @Action(PagesRetrievePage)
  public retrievePage(ctx: StateContext<PagesStateModel>, { chapterIndex, pageIndex }: PagesRetrievePage): void {
    const state = ctx.getState();
    const page = state.chapters[chapterIndex].pages[pageIndex];

    this.pagesService.getContent$(page.src).subscribe((content) => {
      const patchPages = updateItem(pageIndex, patch({ content }));
      const patchChapters = updateItem(chapterIndex, patch({ pages: patchPages }));
      ctx.setState(patch({ chapters: patchChapters }));
    });
  }
}
