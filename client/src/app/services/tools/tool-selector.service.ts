import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tools } from '../../enums/tools'
import { DrawerService } from '../../services/side-nav-drawer/drawer.service';
import { DrawableService } from '../index/drawable/drawable.service';
import { LineService } from '../index/drawable/line/line.service';
import { PencilService } from '../index/drawable/pencil/pencil.service';
// import { DrawablePropertiesService } from '../index/drawable/properties/drawable-properties.service';

@Injectable({
  providedIn: 'root'
})
export class ToolSelectorService {

  $currentTool: BehaviorSubject<Tools>;
  isHidden: boolean;
  private tools: Map<Tools, DrawableService>;
  private tool: DrawableService | undefined;
  private line: LineService;
  private pencil: PencilService;

  constructor(private drawerService: DrawerService) { // Add every tool that is going to be used with it's name format (name, toolService)
    this.tools = new Map<Tools, DrawableService>();
    this.line = new LineService();
    this.pencil = new PencilService();

    this.tools.set(Tools.Line, this.line);
    this.tools.set(Tools.Pencil, this.pencil);
      // Initialize currentTool as the selector(mouse)
    this.isHidden = true;
    this.$currentTool = new BehaviorSubject<Tools>(Tools.Selection);
  }

  initialize(manipulator: Renderer2, image: ElementRef<SVGElement>): void {
    for (const element of this.tools) {
      element[1].initialize(manipulator, image);
    }
  }

  getCurrentTool(): DrawableService | undefined { return this.tool; }

  getLine(): LineService { return this.line; }
  getPencil(): PencilService { return this.pencil; }

  setCurrentTool(tool: Tools): void {
    const foundTool = this.getTool(tool);
    if (foundTool !== undefined) {
      this.tool = foundTool;
      this.isHidden = false;
      this.$currentTool.next(tool);
      this.drawerService.updateDrawer(this.$currentTool.getValue());
    }
  }

  getTool(toFind: Tools): DrawableService | undefined {
    if (this.tools.has(toFind)) {
      return this.tools.get(toFind);
    }
    return undefined;
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
