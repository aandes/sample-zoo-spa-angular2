import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppComponent, AuthorableView } from './app.component';
import { RequestService } from './request.service';
import { ActivatedRoute } from '@angular/router';

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
    private changeDetectorRef: ChangeDetectorRef,
    public activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    dispatchEvent(new CustomEvent('viewinit', {detail: {view: this}}));
    this.populate();
  }

  populate(): Promise<void> {
    return this.requestService.getContent(this)
      .then(content => this.setViewProperties(content));
  }

  refresh(): void {
    this.populate().then(() => this.changeDetectorRef.detectChanges() );
  }

  private parseLinks(obj: any): Link[] {

    const linkArray = [];
    const links = obj['jcr:content'].links;

    if (links) {

      Object.keys(links).forEach((key: string) => {

        if (!(/^jcr:/).test(key)) {

          const link = {} as Link;
          const linkNode = links[key];

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
          const card = cards[key];

          animal.title = card.title;
          animal.description = card.description;
          animal.filePath = this.requestService.getCmsOrigin() +
              card.image.filePath + (this.requestService.isAuthoringMode() ?
                '?_' + Math.random().toString(16) : '');

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
