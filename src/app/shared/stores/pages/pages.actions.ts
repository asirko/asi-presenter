export class PagesInit {
  public static readonly type = '[Pages] init';
  constructor(public course: string) {}
}

export class PagesRetrievePage {
  public static readonly type = '[Pages] retrieve all pages content';
  constructor(public chapterIndex: number, public pageIndex: number) {}
}

export class PagesSavePosition {
  public static readonly type = '[Pages] save current page position in case of comming back on that chapter';
  constructor(public indexes: [number, number]) {}
}

export class PagesSetCurrentIndexes {
  public static readonly type = '[Pages] set the current chapterIndex';
  constructor(public chapterIndex: number, public pageIndex: number) {}
}
