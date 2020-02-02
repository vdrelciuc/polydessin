import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatAccordion} from '@angular/material/expansion';
import {ViewChild} from '@angular/core';

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})

export class UserGuideComponent implements OnInit {

  @ViewChild('myaccordion', {static:true}) myPanels: MatAccordion;
  openAll(){
    this.myPanels.openAll();
  }

  private _currentSubCategorie : string = "Bienvenue";
  previousModuleRoute : string = '';

  constructor(public router: Router) {

  }

  ngOnInit() {
    if (history.state.path !== null && history.state.path !== undefined){
      this.previousModuleRoute = history.state.path;
    }
  }

  /**
   *
   *
   */
  getCurrentSubCategorie(): string {
    return this._currentSubCategorie;
  }


  setCurrentSubCategorie(value: string) {
    this._currentSubCategorie = value;
    this.router.navigate([ '/userGuide', this.getPath() ])
  }


  /**
   *
   *
   */
  findIndex(nom :string) : any[] {
    for (let i : number = 0 ; i< this.categories.length ; ++i){
      for (let j : number = 0 ; j < this.categories[i].type.elements.length ; ++j){
        if (nom === this.categories[i].type.elements[j].nom){
          if (j=== (this.categories[i].type.elements.length -1)){
            return [i,j,true];
          }
          else{
            return [i,j,false];
          }
        }
      }
    }
    return [0,0,true];
  }

  getNextElement() : Object{
    let currentElement : string = this.getCurrentSubCategorie();
    let indexes : any[]= this.findIndex(currentElement);
    if (indexes[2]==true){
      indexes[0]++;
      indexes[1]=0;
    } else {
      indexes[1]++;
    }

    let newElement : string = this.categories[indexes[0]].type.elements[indexes[1]].nom;
    this.setCurrentSubCategorie(newElement);
    this.openAll();
    this.router.navigate([ '/userGuide', this.getPath() ]);
    return this._currentSubCategorie;
  }

  getPreviousElement() : Object {
    let currentElement : string = this.getCurrentSubCategorie();
    let indexes : any[] = this.findIndex(currentElement);
    if (indexes[1]==0){
      indexes[0]--;
      indexes[1]= (this.categories[indexes[0]].type.elements.length -1);
    }
    else
      indexes[1]--;
    let newElement : string = this.categories[indexes[0]].type.elements[indexes[1]].nom;
    this.setCurrentSubCategorie(newElement);
    this.openAll();
    this.router.navigate([ '/userGuide', this.getPath() ]);
    return this._currentSubCategorie;

  }

  getPath() : string {
    let indexes : any[] = this.findIndex(this._currentSubCategorie);
    return this.categories[indexes[0]].type.elements[indexes[1]].path;
  }



  categories : any[] = [
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
          { nom: 'Nouveau Dessin', path: 'nouveauDessin' },
          { nom: 'Nouveau Dessin', path: 'nouveauDessin' },
          { nom: 'Nouveau Dessin', path: 'nouveauDessin' },
          { nom: 'Nouveau Dessin', path: 'nouveauDessin' },
          { nom: 'Nouveau Dessin', path: 'nouveauDessin' },
          { nom: 'Nouveau Dessin', path: 'nouveauDessin' },
          { nom: 'Nouveau Dessin', path: 'nouveauDessin' },
          { nom: 'Nouveau Dessin', path: 'nouveauDessin' }

        ]
      }
    }
  ];



}
