import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DoljakLibTestComponent } from '../../../doljak-lib-to-do-list/src/public-api';

@Component({
  selector: 'app-root',
  imports: [DoljakLibTestComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'playground-app';
}
