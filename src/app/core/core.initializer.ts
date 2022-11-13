import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { PagesInit } from '../shared/stores/pages/pages.actions';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CoreInitializer {
  constructor(private store: Store) {}

  resolve(): Promise<any> {
    const course = new URL(window.location.href).searchParams.get('course') || 'angular';
    return firstValueFrom(this.store.dispatch(new PagesInit(course)));
  }
}
