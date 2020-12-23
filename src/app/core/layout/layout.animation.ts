import { animate, AnimationMetadata, group, query, style, transition, trigger } from '@angular/animations';

function getTransition(horizontalDirection: -1 | 0 | 1, verticalDirection: -1 | 0 | 1): AnimationMetadata[] {
  const enteringPosition = { left: `${horizontalDirection * 100}%`, top: `${verticalDirection * 100}%` };
  const leavingPosition = { left: `${-1 * horizontalDirection * 100}%`, top: `${-1 * verticalDirection * 100}%` };
  return [
    style({ position: 'relative' }),
    query(':enter, :leave', [style({ position: 'absolute', top: 0, left: 0, width: '100%' })], { optional: true }),
    query(':enter', [style(enteringPosition)], { optional: true }),
    group([
      query(':enter', [animate('300ms ease-out', style({ left: 0, top: 0 }))], { optional: true }),
      query(':leave', [animate('300ms ease-out', style(leavingPosition))], { optional: true }),
    ]),
  ];
}

export const slideInAnimation = trigger('routeAnimations', [
  transition('* => right-to-left', getTransition(1, 0)),
  transition('* => left-to-right', getTransition(-1, 0)),
  transition('* => bottom-to-top', getTransition(0, 1)),
  transition('* => top-to-bottom', getTransition(0, -1)),

  // just a dirty workaround to allow to play the same animation twice in row
  transition('* => right-to-left-2', getTransition(1, 0)),
  transition('* => left-to-right-2', getTransition(-1, 0)),
  transition('* => bottom-to-top-2', getTransition(0, 1)),
  transition('* => top-to-bottom-2', getTransition(0, -1)),
]);
