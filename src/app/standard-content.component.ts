import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { RequestService } from './request.service';
import { AppComponent } from './app.component';

declare var app:AppComponent;

@Component({
  moduleId : module.id,
  selector: 'app-standard-content',
  templateUrl: './standard-content.component.html',
  styleUrls: ['./standard-content.component.css'],
  providers: [RequestService]
})


export class StandardContentComponent implements OnInit {
    
    title         : string;
    description   : string;
    buttonHref    : string;
    buttonText    : string;

    constructor(private requestService : RequestService, public changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit(): void {
    
      app.currentView = this;

      this.populate();

    }

    populate(): Promise<void> {

      let that = this;

      return this.requestService.getIndexContent()
          .then(this.parseResponse)
          .then(function (obj: any) {

            that.title = obj["jcr:content"]["zoo-title"]["jcr:title"];
            that.description = obj["jcr:content"]["zoo-description"].text;
            that.buttonText = obj["jcr:content"]["see-aquatic-btn"].text;
            that.buttonHref = obj["jcr:content"]["see-aquatic-btn"].href;
            
          } );

    }

    refresh (): void {

      let that = this;

      this.populate().then(function () {

        that.changeDetectorRef.detectChanges();
        
      });

    }
  
    private parseResponse(res: JSON) {

      let foo = JSON.stringify(res);

      let obj = JSON.parse(foo);

      return new Promise(function (fulfill) {

        fulfill(obj);

      });

    }

}
