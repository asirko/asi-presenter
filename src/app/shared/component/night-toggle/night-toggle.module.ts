import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NightToggleComponent } from './night-toggle.component';

@NgModule({
  declarations: [NightToggleComponent],
  imports: [CommonModule],
  exports: [NightToggleComponent],
})
export class NightToggleModule {}
