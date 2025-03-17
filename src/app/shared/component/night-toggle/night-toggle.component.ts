import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-night-toggle',
  templateUrl: './night-toggle.component.html',
  styleUrls: ['./night-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NightToggleComponent {
  darkMode = false;
}
