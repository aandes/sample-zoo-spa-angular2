import { Component } from '@angular/core';

declare global {
  interface Window {
    app: AppComponent;
  }
}

export interface AuthorableView {
    refresh(): any;
}

@Component({
  moduleId : module.id,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
    public currentView: AuthorableView;
    constructor() { window.app = this; }
}
