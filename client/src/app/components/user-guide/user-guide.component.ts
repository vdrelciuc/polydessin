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


  /**
   * Attributes
   **/
  private _currentCategorie : string ;
  private _currentSubCategorie : string ;
  private _currentDescription : string ;

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
          { nom: 'sauvegarde', description: 'nonDisponible' },
          { nom: 'une autre type de sauvegarde', description: 'nonDisponible' }
        ]
      }
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
