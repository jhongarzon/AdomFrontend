import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './services/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  constructor(private authenticationService: AuthenticationService) { }

}
