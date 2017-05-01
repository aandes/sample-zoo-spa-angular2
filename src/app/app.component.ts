import { Component } from '@angular/core';

declare global {
  
  interface Window {

      app: AppComponent
      
  }

}

@Component({
  moduleId : module.id,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {

    public currentView: any;

    constructor() {

        window.app = this;

    }

}
