import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { AppComponent, AuthorableView } from './app.component';
import { RequestService } from './request.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  moduleId : module.id,
  selector: 'app-standard-content',
  templateUrl: './standard-content.component.html',
  styleUrls: ['./standard-content.component.css'],
  providers: [RequestService]
})

export class StandardContentComponent implements OnInit, AuthorableView {

  title: string;
  description: string;
  buttonHref: string;
  buttonText: string;

  constructor(
    private requestService: RequestService,
    public changeDetectorRef: ChangeDetectorRef,
    public activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    dispatchEvent(new CustomEvent('viewinit', {detail: {view: this}}));
    this.populate();
  }

  populate(): Promise<void> {
    return this.requestService.getContent(this)
      .then((obj: any) => {
        this.title = obj['jcr:content']['zoo-title']['jcr:title'];
        this.description = obj['jcr:content']['zoo-description'].text;
        this.buttonText = obj['jcr:content']['see-aquatic-btn'].text;
        this.buttonHref = obj['jcr:content']['see-aquatic-btn'].href;
      });
  }

  refresh(): void {
    this.populate().then(() => this.changeDetectorRef.detectChanges());
  }

}
