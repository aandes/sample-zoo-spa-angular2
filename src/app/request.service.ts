import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

declare global {
  
  var rapidBeta: any;
  
}

@Injectable()
export class RequestService {

    private animalsContentUrlBase = 'app/data/';
    private aquaticFileName = 'aquatic.json';
    private terrestrialFileName = 'terrestrial.json';
    private indexFileName = 'index.json';

    constructor(private http: Http) { }

    isAuthoringMode(): boolean {
      return document.querySelector("head script[src*='/~rapid/edit/']") !== null
        && (typeof rapidBeta === 'function')
        && !!rapidBeta('mirror.data.cms.page.resourcePath');
    }

  getAquaticContent(): Promise<JSON> {
      let url = this.isAuthoringMode() ?
        rapidBeta('mirror.data.cms.page.resourcePath') + '.infinity.json' :
        this.animalsContentUrlBase + this.aquaticFileName;
     return this.http.get(url)
       .toPromise()
       .then(response => response.json() as JSON)
       .catch(this.handleError);
  }

  getTerrestrialContent(): Promise<JSON> {
    let url = this.isAuthoringMode() ?
      rapidBeta('mirror.data.cms.page.resourcePath') + '.infinity.json' :
      this.animalsContentUrlBase + this.terrestrialFileName;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as JSON)
      .catch(this.handleError);
  }

  getIndexContent(): Promise<JSON> {
    let url = this.isAuthoringMode() ?
      rapidBeta('mirror.data.cms.page.resourcePath') + '.infinity.json' :
      this.animalsContentUrlBase + this.indexFileName;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as JSON)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    console.log(body);
    return body.data || { };
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
}

