import { DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class NoRouteReuseStrategy implements RouteReuseStrategy {
  shouldDetach(): boolean {
    return false;
  }
  store(): void {}
  shouldAttach(): boolean {
    return false;
  }
  retrieve(): DetachedRouteHandle | null {
    return null;
  }
  shouldReuseRoute(): boolean {
    return false;
  }
}
