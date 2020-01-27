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

    if (this._currentSubCategorie =='Bienvenue'){
      // @ts-ignore
      this._currentDescription = this.welcomeObject.description;
      // @ts-ignore
      document.getElementById("description").innerHTML= this._currentDescription;
      return this._currentDescription
    }
    let indexes : any[] = this.findIndex(this._currentSubCategorie);

    this._currentDescription = this.categories[indexes[0]].type.elements[indexes[1]].description;
    // @ts-ignore
    document.getElementById("description").innerHTML= this._currentDescription;
    return this._currentDescription;
  }

  getCurrentSubCategorie(): string {
    return this._currentSubCategorie;
  }
  /**
   * Setters
   **/


  setCurrentSubCategorie(value: string) {
    this._currentSubCategorie = value;
    this.getCurrentDescription();
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
    this.getCurrentDescription();
  }

  getPreviousElement(currentElement : string){
    let indexes : any[] = this.findIndex(currentElement);
    if (currentElement === this.categories[0].type.elements[0].nom){
      this.setCurrentSubCategorie('Bienvenue');
      this.getCurrentDescription();
      return ;
    }
    if (indexes[1]==0){
      indexes[0]--;
      indexes[1]= (this.categories[indexes[0]].type.elements.length -1);
    }
    else
      indexes[1]--;
    let newElement : string = this.categories[indexes[0]].type.elements[indexes[1]].nom;
    this.setCurrentSubCategorie(newElement);
    this.getCurrentDescription();
  }

  /**
   * Attributes
   **/
  currentCategorie : string ;
  private _currentSubCategorie : string = "Bienvenue";
  private _currentDescription : string ;

  welcomeObject : object={ nom: 'Bienvenue',
    description: 'hello'};

  categories : any[] = [
    {
      type: {
        nom: 'Outils',
        elements: [
          { nom: 'Pinceau', description: 'red'},
          { nom: 'Crayon', description: 'hiya'},
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
          { nom: 'Une autre type de sauvegarde', description: 'nonDisponible' },
          { nom: 'last', description: 'nonDisponible' }
        ]
      }
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
