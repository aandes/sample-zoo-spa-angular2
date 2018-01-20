import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppComponent, AuthorableView } from './app.component';
import { RequestService } from './request.service';

declare const app: AppComponent;

@Component({
  moduleId : module.id,
  selector: 'app-animal-list-component',
  templateUrl: './animal-list.component.html',
  styleUrls: ['./animal-list.component.css'],
  providers: [RequestService]
})

export class AnimalListComponent implements OnInit, AuthorableView {

  links: Link[];
  animals: Animal[];
  viewTitle: string;

  constructor(
    private requestService: RequestService,
    public changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    app.currentView = this;
    this.populate();
  }

  populate(): Promise<void> {

    if (location.pathname.indexOf('/aquatic') === 0) {
      return this.showAquatic();
    }

    return this.showTerrestrial();

  }

  refresh(): void {
    this.populate().then(() => this.changeDetectorRef.detectChanges() );
  }

  showAquatic(): Promise<void> {
    return this.requestService.getAquaticContent()
      .then(content => this.setViewProperties(content));
  }

  showTerrestrial(): Promise<void> {
    return this.requestService.getTerrestrialContent()
      .then(content => this.setViewProperties(content));
  }

  private parseLinks(obj: any): Link[] {

    const linkArray = [];
    const links = obj['jcr:content'].links;

    if (links) {

      Object.keys(obj['jcr:content'].links).forEach((key: string) => {

        if (!(/^jcr:/).test(key)) {

          const link = {} as Link;
          const linkNode = obj['jcr:content'].links[key];

          link.href = linkNode.href;
          link.text = linkNode.text;

          linkArray.push(link);

        }

      });

    }

    if (this.requestService.isAuthoringMode()) {
      // OPTIONAL
      // add dummy link
      // can be removed if content owner
      // is not allowed to add new links
      linkArray.push(<Link>{});
    }

    return linkArray;

  }

  parseAnimalCards(obj: any): Animal[] {

    const animals = [];
    const cards = obj['jcr:content'].cards;

    if (cards) {

      Object.keys(cards).forEach((key: string) => {

        if (!(/^jcr:/).test(key)) {

          const animal = {} as Animal;
          const card = obj['jcr:content'].cards[key];

          animal.description = card.description;
          animal.filePath = card.image.filePath;
          animal.title = card['title'];

          animals.push(animal);

        }

      });

    }

    if (this.requestService.isAuthoringMode()) {
      // OPTIONAL
      // add dummy animal
      // can be removed if content owner
      // is not allowed to add new animals
      animals.push(<Animal>{});
    }

    return animals;

  }

  private setViewProperties(obj: any) {
    this.viewTitle = obj['jcr:content']['jcr:title'];
    this.animals = this.parseAnimalCards(obj);
    this.links = this.parseLinks(obj);
  }

}
