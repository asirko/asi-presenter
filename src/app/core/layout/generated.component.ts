import { AfterViewInit, ChangeDetectionStrategy, Component, Directive, ElementRef } from '@angular/core';

@Component({
  selector: 'app-generated',
  templateUrl: './generated.component.html',
  styleUrls: ['./generated.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneratedComponent {}

@Directive({ selector: 'input[appAutoFocus]' })
export class AutoFocusDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef<HTMLInputElement>) {}

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.focus();
  }
}
