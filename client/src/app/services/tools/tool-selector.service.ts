import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DrawerService } from '../../services/side-nav-drawer/drawer.service';

import { Tools } from '../../enums/tools'

@Injectable({
  providedIn: 'root'
})
export class ToolSelectorService {

  $currentTool: BehaviorSubject<Tools>;

  constructor(private drawerService: DrawerService) {
    this.$currentTool = new BehaviorSubject<Tools>(Tools.None);
  }

  setCurrentTool(tool: Tools): void {
    this.$currentTool.next(tool);
    this.drawerService.updateDrawer(this.$currentTool.getValue());
  }

  getFrenchToolNameToPrint(): string {
    switch (this.$currentTool.getValue()) {
      case Tools.Aerosol: return 'Aérosol';
      case Tools.Brush: return 'Pinceau';
      case Tools.Bucket: return 'Sceau de peinture';
      case Tools.ColorApplicator: return 'Applicateur de couleur';
      case Tools.Ellipse: return 'Ellipse';
      case Tools.Eraser: return 'Efface';
      case Tools.Feather: return 'Plume';
      case Tools.Grid: return 'Grille';
      case Tools.Line: return 'Ligne';
      case Tools.Pencil: return 'Crayon';
      case Tools.Pipette: return 'Pipette';
      case Tools.Polygon: return 'Polygone';
      case Tools.Rectangle: return 'Rectangle';
      case Tools.Selection: return 'Sélection';
      case Tools.Settings: return 'Réglages';
      case Tools.Stamp: return 'Étampe';
      case Tools.Text: return 'Texte';
      default : return Tools.None;
    }
  }
}
