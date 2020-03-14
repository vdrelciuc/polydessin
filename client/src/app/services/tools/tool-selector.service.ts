import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tools } from '../../enums/tools';
import { DrawerService } from '../../services/side-nav-drawer/drawer.service';
import { ColorSelectorService } from '../color-selector.service';
import { BrushService } from '../index/drawable/brush/brush.service';
import { ColorApplicatorService } from '../index/drawable/colorApplicator/color-applicator.service';
import { DrawableService } from '../index/drawable/drawable.service';
import { EllipseService } from '../index/drawable/ellipse/ellipse.service';
import { EraserService } from '../index/drawable/eraser/eraser.service';
import { GridService } from '../index/drawable/grid/grid.service';
import { LineService } from '../index/drawable/line/line.service';
import { PencilService } from '../index/drawable/pencil/pencil.service';
import { PolygonService } from '../index/drawable/polygon/polygon.service';
import { RectangleService } from '../index/drawable/rectangle/rectangle.service';
import { SelectionService } from '../index/drawable/selection/selection.service';
import { SprayService } from '../index/drawable/spray/spray.service';
import { PipetteService } from '../pipette.service';
import { DrawStackService } from './draw-stack/draw-stack.service';
import { UndoRedoService } from './undo-redo/undo-redo.service';

@Injectable({
  providedIn: 'root'
})
export class ToolSelectorService {

  $currentTool: BehaviorSubject<Tools>;
  memory: UndoRedoService;
  private tools: Map<Tools, DrawableService>;
  private tool: DrawableService | undefined;
  private line: LineService;
  private pencil: PencilService;
  private rectangle: RectangleService;
  private brush: BrushService;
  private polygon: PolygonService;
  private selection: SelectionService;
  private colorApplicator: ColorApplicatorService;
  private spray: SprayService;
  private grid: GridService;

  private ellipse: EllipseService;
  private eraser: EraserService;
  private pipette: PipetteService;

  constructor(private drawerService: DrawerService) { // Add every tool that is going to be used with it's name format (name, toolService)
    this.tools = new Map<Tools, DrawableService>();
    this.line = new LineService();
    this.pencil = new PencilService();
    this.rectangle = new RectangleService();
    this.brush = new BrushService();
    this.pipette = new PipetteService();
    this.ellipse = new EllipseService();
    this.eraser = new EraserService();
    this.polygon = new PolygonService();
    this.selection = new SelectionService();
    this.colorApplicator = new ColorApplicatorService();
    this.spray = new SprayService();
    this.grid = new GridService();

    this.tools.set(Tools.Spray, this.spray);
    this.tools.set(Tools.ColorApplicator, this.colorApplicator);
    this.tools.set(Tools.Polygon, this.polygon);
    this.tools.set(Tools.Selection, this.selection);
    this.tools.set(Tools.Line, this.line);
    this.tools.set(Tools.Pencil, this.pencil);
    this.tools.set(Tools.Rectangle, this.rectangle);
    this.tools.set(Tools.Brush, this.brush);
    this.tools.set(Tools.Pipette, this.pipette);
    this.tools.set(Tools.Ellipse, this.ellipse);
    this.tools.set(Tools.Eraser, this.eraser);
    this.tools.set(Tools.Grid, this.grid);
    this.$currentTool = new BehaviorSubject<Tools>(Tools.None);
    this.setCurrentTool(Tools.Selection);
  }

  initialize(manipulator: Renderer2, image: ElementRef<SVGElement>, colorSelectorService: ColorSelectorService, drawStack: DrawStackService, canvas: ElementRef<HTMLCanvasElement>): void {
    this.memory = new UndoRedoService(drawStack, manipulator, image);
    for (const element of this.tools) {
      element[1].initialize(manipulator, image, colorSelectorService, drawStack);
    }
    this.pipette.setupCanvas(canvas);
    // this.eraser.assignUndoRedo(this.memory);
    this.memory.changed.subscribe(
      () => {
        if(this.memory.changed.value) {
          this.memory.changed.next(false);
          if(this.tool !== undefined) {
            this.tool.endTool();
            this.tool.onSelect();
          }
        }
      }
    );
  }

  getCurrentTool(): DrawableService | undefined { return this.tool; }

  getLine(): LineService { return this.line; }
  getPencil(): PencilService { return this.pencil; }
  getRectangle(): RectangleService { return this.rectangle; }
  getBrush(): BrushService { return this.brush; }
  getPipette(): PipetteService { return this.pipette; }
  getPolygon(): PolygonService { return this.polygon; }
  getEllipse(): EllipseService { return this.ellipse; }
  getEraser(): EraserService { return this.eraser; }
  getSelection(): SelectionService { return this.selection; }
  getColorApplicator(): ColorApplicatorService { return  this.colorApplicator; }
  getSpray(): SprayService { return  this.spray; }
  getGrid(): GridService { return this.grid; }

  setCurrentTool(tool: Tools): void {
    const foundTool = this.getTool(tool);
    if (foundTool !== undefined) {
      if (this.tool !== undefined) {
        this.tool.endTool();
      }
      this.tool = foundTool;
      this.tool.onSelect();
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
}
