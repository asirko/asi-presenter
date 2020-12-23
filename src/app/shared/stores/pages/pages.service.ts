import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagesStateModel } from './pages.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

interface Response {
  author: string;
  email: string;
  title: string;
  logos: string[];
  chapters: {
    title: string;
    pages: string[];
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class PagesService {
  constructor(private http: HttpClient) {}

  getSummary$(resourceUrl: string): Observable<PagesStateModel> {
    return this.http.get<Response>(resourceUrl).pipe(
      map((res) => ({
        ...res,
        chapters: res.chapters.map((c) => ({ ...c, pages: c.pages.map((p) => ({ src: p })) })),
      })),
    );
  }

  getContent$(src: string): Observable<string> {
    return this.http.get(src, { responseType: 'text', observe: 'body' });
  }
}
