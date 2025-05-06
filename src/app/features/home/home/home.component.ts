import { Component } from '@angular/core';
import { HeaderComponent } from '../../../layout/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  // Will add more functionality as we build out the application
}