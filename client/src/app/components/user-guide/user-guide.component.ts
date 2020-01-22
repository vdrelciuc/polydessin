import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})
export class UserGuideComponent implements OnInit {
  // catégorie[position de la catégorie][positionDeL'outil].champs de l'outil
  categories : any[] = [
    {
      type: {
        nom: 'Outils',
        elements: [
          { nom: 'Pinceau', description: 'nonDisponible'},
          { nom: 'Crayon', description: 'nonDisponible'},
          { nom: 'Ligne', description: 'nonDisponible'},
          { nom: 'Rectangle', description: 'nonDisponible'},
          { nom: 'Couleur', description: 'nonDisponible'}
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
