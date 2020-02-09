import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion} from '@angular/material/expansion';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})

export class UserGuideComponent implements OnInit {

  constructor(public router: Router,
              public dialogRef : MatDialogRef<UserGuideComponent>
              ) {

  }

  @ViewChild('myaccordion', {static: true}) myPanels: MatAccordion;

  private currentSubCategorie = 'Bienvenue';
  previousModuleRoute = '';

  categories: any[] = [
    {
      type: {
        nom: 'nonReproductible',
        elements: [
          { nom: 'Bienvenue', path: 'bienvenue'}
        ]
      }
    },

    {
      type: {
        nom: 'Outils',
        elements: [
          { nom: 'Pinceau', path: 'pinceau'},
          { nom: 'Crayon', path: 'crayon'},
          { nom: 'Couleur', path: 'couleur'},
        ]
      }
    },

    {
      type: {
        nom: 'Formes',
        elements: [
          { nom: 'Ligne', path: 'ligne'},
          { nom: 'Rectangle', path: 'rectangle'}
        ]
      }
    },

    {
      type: {
        nom: 'Fonctionalites',
        elements: [
          { nom: 'Nouveau Dessin', path: 'nouveauDessin' }

        ]
      }
    }
  ];

  ngOnInit() {
    if (history.state.path !== null && history.state.path !== undefined) {
      this.previousModuleRoute = history.state.path;
    }
  }

  openAll() {
    this.myPanels.openAll();
  }

  /**
   *
   *
   */
  getCurrentSubCategorie(): string {
    return this.currentSubCategorie;
  }

  setCurrentSubCategorie(value: string) {
    this.currentSubCategorie = value;
    this.router.navigate([{outlets : { guideSubCategory : [this.getPath()] }}]);
  }

  /**
   *
   *
   */
  findIndex(nom: string): any[] {
    for (let i = 0 ; i < this.categories.length ; ++i) {
      for (let j = 0 ; j < this.categories[i].type.elements.length ; ++j) {
        if (nom === this.categories[i].type.elements[j].nom) {
          if (j === (this.categories[i].type.elements.length - 1)) {
            return [i, j, true];
          } else {
            return [i, j, false];
          }
        }
      }
    }
    return [0, 0, true];
  }

  getNextElement(): string {
    const currentElement: string = this.getCurrentSubCategorie();
    if(currentElement === 'Nouveau Dessin') {
      return 'Nouveau Dessin';
    }
    const indexes: any[] = this.findIndex(currentElement);
    if (indexes[2] === true) {
      indexes[0]++;
      indexes[1] = 0;
    } else {
      indexes[1]++;
    }

    const newElement: string = this.categories[indexes[0]].type.elements[indexes[1]].nom;
    this.setCurrentSubCategorie(newElement);
    this.openAll();
    this.router.navigate([{outlets : { guideSubCategory : [this.getPath()] }}]);

    return this.currentSubCategorie;
  }

  getPreviousElement(): string {
    const currentElement: string = this.getCurrentSubCategorie();
    if(currentElement === 'Bienvenue') {
      return 'Bienvenue';
    }
    const indexes: any[] = this.findIndex(currentElement);
    if (indexes[1] === 0) {
      indexes[0]--;
      indexes[1] = (this.categories[indexes[0]].type.elements.length - 1);
    } else {
      indexes[1]--;
    }
    const newElement: string = this.categories[indexes[0]].type.elements[indexes[1]].nom;
    this.setCurrentSubCategorie(newElement);
    this.openAll();
    this.router.navigate([{outlets : { guideSubCategory : [this.getPath()] }}]);

    return this.currentSubCategorie;

  }

  getPath(): string {
    const indexes: any[] = this.findIndex(this.currentSubCategorie);
    return this.categories[indexes[0]].type.elements[indexes[1]].path;
  }

  closeGuide(){
    this.dialogRef.close();
  }

}
