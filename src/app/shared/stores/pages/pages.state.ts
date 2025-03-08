import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PagesInit, PagesSavePosition, PagesSetCurrentIndexes } from './pages.actions';
import { Chapter, NavInfo, Page, PagesStateModel } from './pages.model';
import { firstValueFrom } from 'rxjs';
import { PagesService } from './pages.service';
import { Injectable } from '@angular/core';
import { patch, updateItem } from '@ngxs/store/operators';
import { parsedSrc } from '../../pipes/src.pipe';

@State<PagesStateModel>({
  name: 'pages',
  defaults: undefined,
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
  static getChapterTitle(state: PagesStateModel | undefined): string {
    if (!state || (!state.currentChapterIndex && state.currentChapterIndex !== 0)) {
      return '';
    }
    return state.chapters[state.currentChapterIndex].title;
  }

  @Selector()
  static getNavIndexes(state: PagesStateModel): (currentChapterIndex: number, currentPageIndex: number) => NavInfo {
    return (currentChapterIndex: number, currentPageIndex: number) => {
      const nav = {
        prevChapter: undefined as [number, number] | undefined,
        nextChapter: undefined as [number, number] | undefined,
        prevPage: undefined as [number, number] | undefined,
        nextPage: undefined as [number, number] | undefined,
      };
      if (state && currentPageIndex > 0) {
        nav.prevPage = [currentChapterIndex, currentPageIndex - 1];
      }
      if (state && currentPageIndex < state.chapters[currentChapterIndex].pages.length - 1) {
        nav.nextPage = [currentChapterIndex, currentPageIndex + 1];
      }
      if (state && currentChapterIndex > 0) {
        nav.prevChapter = [currentChapterIndex - 1, state.previousPageIndexes[currentChapterIndex - 1]];
      }
      if (state && currentChapterIndex < state.chapters.length - 1) {
        nav.nextChapter = [currentChapterIndex + 1, state.previousPageIndexes[currentChapterIndex + 1]];
      }
      return nav;
    };
  }

  @Selector()
  static getPageContent(state: PagesStateModel): (chapterIndex: number, pageIndex: number) => string | undefined {
    return (chapterIndex: number, pageIndex: number) => {
      if (!state || !state.chapters[chapterIndex].pages[pageIndex]) {
        return 'slide is not define in summary';
      }
      return state?.chapters[chapterIndex].pages[pageIndex].content;
    };
  }

  @Selector()
  static getChapterProgression(state: PagesStateModel): number {
    if (
      (!state.currentChapterIndex && state.currentChapterIndex !== 0) ||
      (!state.currentPageIndex && state.currentPageIndex !== 0)
    ) {
      return 0;
    }
    const chapter = state.chapters[state.currentChapterIndex];
    return ((state.currentPageIndex + 1) * 100) / chapter.pages.length;
  }

  @Selector()
  static getMainProgression(state: PagesStateModel): string {
    if (!state.currentChapterIndex && state.currentChapterIndex !== 0) {
      return 'N-A';
    }
    return `${state.currentChapterIndex + 1} / ${state.chapters.length}`;
  }

  @Selector()
  static getLogos(state: PagesStateModel): string[] {
    return state.logos;
  }

  constructor(private pagesService: PagesService) {}

  @Action(PagesInit)
  async init(ctx: StateContext<PagesStateModel>, { course }: PagesInit): Promise<void> {
    const summary = await firstValueFrom(this.pagesService.getSummary$(parsedSrc('~/summary.json', course)));
    const chapters = await Promise.all(summary.chapters.map(chapter => this.#getChapterContents(chapter, course)));
    ctx.setState({
      ...summary,
      course,
      chapters,
      previousPageIndexes: chapters.map(() => 0),
    });
  }

  async #getChapterContents(chapter: Chapter, course: string): Promise<Chapter> {
    const pages = await Promise.all(chapter.pages.map(page => this.#getPageContent(page, course)));
    return { ...chapter, pages };
  }

  async #getPageContent(page: Page, course: string): Promise<Page> {
    const content = await firstValueFrom(this.pagesService.getContent$(parsedSrc(page.src, course)));
    return { ...page, content };
  }

  @Action(PagesSavePosition)
  savePosition(ctx: StateContext<PagesStateModel>, { indexes }: PagesSavePosition): void {
    ctx.setState(patch({ previousPageIndexes: updateItem(indexes[0], indexes[1]) }));
  }

  @Action(PagesSetCurrentIndexes)
  setCurrentIndexes(ctx: StateContext<PagesStateModel>, { chapterIndex, pageIndex }: PagesSetCurrentIndexes): void {
    ctx.patchState({
      currentChapterIndex: chapterIndex,
      currentPageIndex: pageIndex,
    });
  }
}
