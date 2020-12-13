interface Page {
  src: string;
  content?: string;
}

export interface Chapter {
  title: string;
  pages: Page[];
}

export interface PagesStateModel {
  author: string;
  email: string;
  title: string;
  chapters: Chapter[];
  currentChapterIndex?: number;
  previousPageIndexes?: number[]; // for each chapter keep the last shown page to go back on it
}

export interface NavInfo {
  prevChapter: [number, number];
  nextChapter: [number, number];
  prevPage: [number, number];
  nextPage: [number, number];
}
