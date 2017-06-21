import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RequestService } from './request.service';
import { AppComponent } from './app.component';
import { Animal } from './animal';
import { Link } from './link';

declare var app:AppComponent;

@Component({
  moduleId : module.id,
  selector: 'animal-list-component',
  templateUrl: './animal-list.component.html',
  styleUrls: ['./animal-list.component.css'],
  providers: [RequestService]
})

export class AnimalListComponent implements OnInit {

  animals : Animal[];
  viewTitle : string;
  links : Link[];

  constructor(private requestService : RequestService, public changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {

    app.currentView = this;
    
    this.populate();

  }

  populate(): Promise<void> {

    if (window.location.href.indexOf('aquatic') != -1) {

      return this.showAquatic();

    }
    
    return this.showTerrestrial();

  }

  refresh (): void {

    let that = this;
    
    this.populate().then(function () {

      that.changeDetectorRef.detectChanges();

    });
    
  }

  showAquatic(): Promise<void> {
    let that = this;

    return this.requestService.getAquaticContent()
      .then(this.parseResponse)
      .then(function (obj: any) {

        that.viewTitle = obj["jcr:content"]["jcr:title"];

        that.animals = that.parseAnimalCards(obj);
        that.links = that.parseLinks(obj);

      } );
  }

  showTerrestrial(): Promise<void> {
    let that = this;
    
    return this.requestService.getTerrestrialContent()
      .then(this.parseResponse)
      .then(function (obj: any) {

        that.viewTitle = obj["jcr:content"]["jcr:title"];

        that.animals = that.parseAnimalCards(obj);
        that.links = that.parseLinks(obj);

      } );
  }

  parseLinks(obj: any): Link[] {
    let linkArray = [];
    let links = obj["jcr:content"].links;

    links && Object.keys(obj["jcr:content"].links).forEach(function (key: string) {

      if (!(/^jcr:/).test(key)) {
        let link = new Link();
        let linkNode = obj["jcr:content"].links[key];

        link.href = linkNode.href;
        link.text = linkNode.text;

        linkArray.push(link);
      }

    });

    // add dummy link
    // can be removed if content owner
    // is not allowed to add new links
    linkArray.push(<Link>{});

    return linkArray;
  }

  parseAnimalCards(obj: any): Animal[] {
    let animals = [];
    let cards = obj["jcr:content"].cards;

    cards && Object.keys(cards).forEach(function (key: string) {

      if (!(/^jcr:/).test(key)) {
        let animal = new Animal();
        let card = obj["jcr:content"].cards[key];

        animal.description = card.description;
        animal.filePath = card.image.filePath;
        animal.title = card["title"];

        animals.push(animal);
      }

    });

    // add dummy animal
    // can be removed if content owner
    // is not allowed to add new animals
    animals.push(<Animal>{});

    return animals;
  }

  private parseResponse(res: JSON) {

    let foo = JSON.stringify(res);

      let obj = JSON.parse(foo);

      return new Promise(function (fulfill) {

        fulfill(obj);

      });

  }

}
