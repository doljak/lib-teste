import { Component } from '@angular/core';
import { LoginComponent } from './pages/login/login.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'doljak-lib-test',
  imports: [CommonModule, RouterOutlet],
  templateUrl: 'doljak-lib-to-do-list.component.html',
  styleUrls:[] 
})
export class DoljakLibTestComponent {

}
