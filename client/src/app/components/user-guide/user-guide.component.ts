import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})
export class UserGuideComponent implements OnInit {
  /**
   * Getters
   **/
  getCurrentDescription(): string {
    return this._currentDescription;
  }

  getCurrentCategorie(): string {
    return this._currentCategorie;
  }

  getCurrentSubCategorie(): string {
    return this._currentSubCategorie;
  }
  /**
   * Setters
   **/
  setCurrentCategorie(value: string) {
    this._currentCategorie = value;
  }

  setCurrentSubCategorie(value: string) {
    this._currentSubCategorie = value;
  }

  setCurrentDescription(value: string) {
    this._currentDescription = value;
  }
  /**
   * Functions
   **/


  findIndex(nom :string) : any[] {
    if(nom === 'Bienvenue' )
      return [0,0,true];
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

  getNextElement(currentElement : string){
    let indexes : any[]= this.findIndex(currentElement);
    if (currentElement !== 'Bienvenue'){
      if (indexes[2]==true){
        indexes[0]++;
        indexes[1]=0;
      }
      else
        indexes[1]++;
    }
    let newElement : string = this.categories[indexes[0]].type.elements[indexes[1]].nom;
    this.setCurrentSubCategorie(newElement);
  }

  getPreviousElement(indexes : any[]){
    if (indexes[1]==0){
      indexes[0]--;
      indexes[1]= (this.categories[indexes[0]].type.elements.length -1);
    }
    else
      indexes[1]--;
    let newElement : string = this.categories[indexes[0]].type.elements[indexes[1]].nom;
    this.setCurrentSubCategorie(newElement);
  }

  /**
   * Attributes
   **/
  private _currentCategorie : string ;
  private _currentSubCategorie : string = "Bienvenue";
  private _currentDescription : string ;

  welcomeObject : object={ nom: 'Bienvenue', description: 'nonDisponible'};

  categories : any[] = [
    {
      type: {
        nom: 'Outils',
        elements: [
          { nom: 'Pinceau', description: 'nonDisponible'},
          { nom: 'Crayon', description: 'nonDisponible'},
          { nom: 'Ligne', description: 'nonDisponible'},
          { nom: 'Rectangle', description: 'nonDisponible'},
          { nom: 'Couleur', description: 'nonDisponible'},
        ]
      }
    },

    {
      type: {
        nom: 'Fichier',
        elements: [
          { nom: 'Sauvegarde', description: 'nonDisponible' },
          { nom: 'Une autre type de sauvegarde', description: 'nonDisponible' }
        ]
      }
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
