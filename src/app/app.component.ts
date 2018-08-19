import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export interface AuthorableView {
    activatedRoute: ActivatedRoute;
    refresh(): any;
}

@Component({
  moduleId : module.id,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  private currentView: AuthorableView|null = null;

  constructor() {

    // dispatched by our Angular view components on init
    addEventListener('viewinit', (e: CustomEvent) =>
      this.currentView = e.detail.view, false);

    // dispached from our CMS components after edit
    addEventListener('cmscomponentchange', (e: Event) => {
        e.preventDefault(); // do not reload the page
        if (this.currentView) {
          this.currentView.refresh(); // rather refresh this view
        }
    }, false);

  }

}
