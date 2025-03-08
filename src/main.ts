import { bootstrapApplication } from '@angular/platform-browser';
import { coreConfig } from './app/core/core.config';
import { LayoutComponent } from './app/core/layout/layout.component';

bootstrapApplication(LayoutComponent, coreConfig).catch(err => console.error(err));
