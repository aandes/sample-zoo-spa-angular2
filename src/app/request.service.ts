import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { AuthorableView } from './app.component';

declare global {
  const rapid: any;
}

@Injectable()
export class RequestService {

  // todo, load from config file
  private cmsOrigin = 'http://localhost:4502';
  private cmsContentPath = '/content/sample-zoo-spa-angular2/${path}.infinity.json';

  constructor(private http: Http) {}

  isAuthoringMode(): boolean {
    return typeof rapid !== 'undefined' &&
      rapid.mirror().isAuthoringEnabled();
  }

  getCmsOrigin() {
    return this.cmsOrigin;
  }

  getContent(view: AuthorableView): Promise<any> {
    return this.load(view.activatedRoute.snapshot.url.toString());
  }

  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  private contentUrl(page: string) {
    return this.cmsOrigin +
      this.cmsContentPath.replace(/\$\{path\}/, page);
  }

  private load(page: string): Promise<any> {
    // in a real world, the staticContentPath might be a content service URL
    const url = this.contentUrl(page);
    return this.http.get(url,
        // withCredentials is not necessary for cms publish intances
        {withCredentials: true}).toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

}

