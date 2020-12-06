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
}
