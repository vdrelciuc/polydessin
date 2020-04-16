import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatAccordion} from '@angular/material/expansion';
import { Router } from '@angular/router';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})

export class UserGuideComponent implements OnInit {

  private currentSubCategorie: string;
  previousModuleRoute: string;

  constructor(
    private shortcutManager: ShortcutManagerService,
    public router: Router,
    public dialogRef: MatDialogRef<UserGuideComponent>
    ) {
      this.shortcutManager.disableShortcuts();
      this.currentSubCategorie = 'Bienvenue';
      this.previousModuleRoute = '';
  }

  @ViewChild('myaccordion', {static: true}) myPanels: MatAccordion;

  // tslint:disable-next-line: no-any | Reason : custom element type
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
          { nom: 'Plume', path: 'feather'},
          { nom: 'Couleur', path: 'couleur'},
        ]
      }
    },

    {
      type: {
        nom: 'Formes',
        elements: [
          { nom: 'Ligne', path: 'ligne'},
          { nom: 'Rectangle', path: 'rectangle'},
          { nom: 'Ellipse', path: 'ellipse'},
          { nom: 'Aerosol', path: 'aerosol'},
          { nom: 'Polygone', path: 'polygone'}
        ]
      }
    },

    {
      type: {
        nom: 'Fonctionalites',
        elements: [
          { nom: 'Pipette', path: 'pipette' },
          { nom: 'Applicateur de Couleur', path: 'applyer' },
          { nom: 'Sceau de peinture', path: 'sceau' },
          { nom: 'Selection et déplacement', path: 'selection' },
          { nom: 'Rotation', path: 'selection' },
          { nom: 'Presse papier', path: 'clipboard' },
          { nom: 'Grille', path: 'grid' },
          { nom: 'Exportation', path: 'export' },
          { nom: 'Envoi par mail', path: 'mail' },
          { nom: 'Gallerie', path: 'gallery' },
          { nom: 'Sauvegarde sur serveur', path: 'saveServer' },
          { nom: 'Sauvegarde automatique', path: 'autoSave' },
          { nom: 'Annuler refaire', path: 'undo' },
          { nom: 'Nouveau Dessin', path: 'nouveauDessin' }

        ]
      }
    }
  ];

  ngOnInit(): void {
    if (history.state.path !== null && history.state.path !== undefined) {
      this.previousModuleRoute = history.state.path;
    }
  }

  openAll(): void {
    this.myPanels.openAll();
  }

  getCurrentSubCategorie(): string {
    return this.currentSubCategorie;
  }

  setCurrentSubCategorie(value: string): void {
    this.currentSubCategorie = value;
    this.router.navigate([{outlets : { guideSubCategory : [this.getPath()] }}], { skipLocationChange: true });
  }

  findIndex(nom: string): [number, number, boolean] {
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
    if (currentElement === 'Nouveau Dessin') {
      return 'Nouveau Dessin';
    }
    // tslint:disable-next-line: no-any | Reason : custom element type
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
    this.router.navigate([{outlets : { guideSubCategory : [this.getPath()] }}], { skipLocationChange: true });

    return this.currentSubCategorie;
  }

  getPreviousElement(): string {
    const currentElement: string = this.getCurrentSubCategorie();
    if (currentElement === 'Bienvenue') {
      return 'Bienvenue';
    }
    // tslint:disable-next-line: no-any | Reason : custom element type
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
    this.router.navigate([{outlets : { guideSubCategory : [this.getPath()] }}], { skipLocationChange: true });

    return this.currentSubCategorie;

  }

  getPath(): string {
    // tslint:disable-next-line: no-any | Reason : custom element type
    const indexes: any[] = this.findIndex(this.currentSubCategorie);
    return this.categories[indexes[0]].type.elements[indexes[1]].path;
  }

  closeGuide(): void {
    this.dialogRef.close();
    this.shortcutManager.setupShortcuts();
    this.router.navigate([{outlets: {guideSubCategory: null}}]);
  }

}
