import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

declare global {
  const rapidBeta: any;
}

@Injectable()
export class RequestService {

  private animalsContentUrlBase = 'app/data/';
  private aquaticContent = 'aquatic.json';
  private terrestrialContent = 'terrestrial.json';
  private indexContentFile = 'index.json';

  constructor(private http: Http) {}

  isAuthoringMode(): boolean {
    return document.querySelector('head script[src*="/bin/~rapid/edit."]') !== null
      && (typeof rapidBeta === 'function')
      && !!rapidBeta('mirror.data.cms.page.resourcePath');
  }

  getAquaticContent(): Promise<any> {
    return this.load(this.aquaticContent);
  }

  getTerrestrialContent(): Promise<any> {
    return this.load(this.terrestrialContent);
  }

  getIndexContent(): Promise<any> {
    return this.load(this.indexContentFile);
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

  private cmsContentUrl() {
    return this.isAuthoringMode() ?
      rapidBeta('mirror.data.cms.page.resourcePath') + '.infinity.json' : null;
  }

  private contentUrl(page: string) {
    return this.animalsContentUrlBase + page;
  }

  private load(staticContentPath: string): Promise<any> {
    // in a real world, the staticContentPath might be a content service URL
    const url = this.cmsContentUrl() || this.contentUrl(staticContentPath);
    return this.http.get(url).toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

}

