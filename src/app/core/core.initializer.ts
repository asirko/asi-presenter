import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { PagesInit } from '../shared/stores/pages/pages.actions';

@Injectable({ providedIn: 'root' })
export class CoreInitializer {
  constructor(private store: Store) {}
  resolve(): Promise<any> {
    return this.store.dispatch(new PagesInit()).toPromise();
  }
}
