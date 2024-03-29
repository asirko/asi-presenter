import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
  PagesInit,
  PagesRetrievePage,
  PagesSavePosition,
  PagesSetCurrentIndexes,
} from './pages.actions';
import { NavInfo, PagesStateModel } from './pages.model';
import { forkJoin, Observable } from 'rxjs';
import { PagesService } from './pages.service';
import { Injectable } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { patch, updateItem } from '@ngxs/store/operators';
import { parsedSrc } from '../../pipes/src.pipe';

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
    return state.author;
  }
  @Selector()
  static getEmail(state: PagesStateModel): string {
    return state.email;
  }
  @Selector()
  static getMainTitle(state: PagesStateModel): string {
    return state.title;
  }
  @Selector()
  static getCourse(state: PagesStateModel): string {
    return state.course;
  }
  @Selector()
  static getChapterTitle(state: PagesStateModel): string {
    return state.chapters[state.currentChapterIndex].title;
  }

  @Selector()
  static getNavIndexes(
    state: PagesStateModel
  ): (currentChapterIndex: number, currentPageIndex: number) => NavInfo {
    return (currentChapterIndex: number, currentPageIndex: number) => {
      const nav = {
        prevChapter: null,
        nextChapter: null,
        prevPage: null,
        nextPage: null,
      };
      if (state && currentPageIndex > 0) {
        nav.prevPage = [currentChapterIndex, currentPageIndex - 1];
      }
      if (
        state &&
        currentPageIndex < state.chapters[currentChapterIndex].pages.length - 1
      ) {
        nav.nextPage = [currentChapterIndex, currentPageIndex + 1];
      }
      if (state && currentChapterIndex > 0) {
        nav.prevChapter = [
          currentChapterIndex - 1,
          state.previousPageIndexes[currentChapterIndex - 1],
        ];
      }
      if (state && currentChapterIndex < state.chapters.length - 1) {
        nav.nextChapter = [
          currentChapterIndex + 1,
          state.previousPageIndexes[currentChapterIndex + 1],
        ];
      }
      return nav;
    };
  }

  @Selector()
  static getPageContent(
    state: PagesStateModel
  ): (chapterIndex: number, pageIndex: number) => string {
    return (chapterIndex: number, pageIndex: number) => {
      if (!state || !state.chapters[chapterIndex].pages[pageIndex]) {
        return 'slide is not define in summary';
      }
      return state?.chapters[chapterIndex].pages[pageIndex].content;
    };
  }

  @Selector()
  static getChapterProgression(state: PagesStateModel): number {
    const chapter = state.chapters[state.currentChapterIndex];
    return ((state.currentPageIndex + 1) * 100) / chapter.pages.length;
  }

  @Selector()
  static getMainProgression(state: PagesStateModel): string {
    return `${state.currentChapterIndex + 1} / ${state.chapters.length}`;
  }

  @Selector()
  static getLogos(state: PagesStateModel): string[] {
    return state.logos;
  }

  constructor(private pagesService: PagesService, private store: Store) {}

  @Action(PagesInit)
  public init(
    ctx: StateContext<PagesStateModel>,
    { course }: PagesInit
  ): Observable<any> {
    return this.pagesService
      .getSummary$(parsedSrc('~/summary.json', course))
      .pipe(
        switchMap((summary: PagesStateModel) => {
          ctx.setState({
            ...summary,
            course,
            previousPageIndexes: summary.chapters.map(() => 0),
          });
          // retrieve all contents once the summary is retrieved
          const eachContents$ = summary.chapters.reduce(
            (arr, c, ci) =>
              arr.concat(
                c.pages.map((p, pi) =>
                  this.store.dispatch(new PagesRetrievePage(ci, pi))
                )
              ),
            []
          );
          return forkJoin(eachContents$);
        })
      );
  }

  @Action(PagesRetrievePage)
  public retrievePage(
    ctx: StateContext<PagesStateModel>,
    { chapterIndex, pageIndex }: PagesRetrievePage
  ): Observable<any> {
    const state = ctx.getState();
    const page = state.chapters[chapterIndex].pages[pageIndex];

    return this.pagesService
      .getContent$(parsedSrc(page.src, state.course))
      .pipe(
        tap((content) => {
          const patchPages = updateItem(pageIndex, patch({ content }));
          const patchChapters = updateItem(
            chapterIndex,
            patch({ pages: patchPages })
          );
          ctx.setState(patch({ chapters: patchChapters }));
        })
      );
  }

  @Action(PagesSavePosition)
  public savePosition(
    ctx: StateContext<PagesStateModel>,
    { indexes }: PagesSavePosition
  ): void {
    ctx.setState(
      patch({ previousPageIndexes: updateItem(indexes[0], indexes[1]) })
    );
  }

  @Action(PagesSetCurrentIndexes)
  public setCurrentIndexes(
    ctx: StateContext<PagesStateModel>,
    { chapterIndex, pageIndex }: PagesSetCurrentIndexes
  ): void {
    ctx.patchState({
      currentChapterIndex: chapterIndex,
      currentPageIndex: pageIndex,
    });
  }
}
