export class PagesInit {
  public static readonly type = '[Pages] init';
  constructor() {}
}

export class PagesRetrievePage {
  public static readonly type = '[Pages] retrieve all pages content';
  constructor(public chapterIndex: number, public pageIndex: number) {}
}
