import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tools } from '../../enums/tools';
import { DrawerService } from '../../services/side-nav-drawer/drawer.service';
import { ColorSelectorService } from '../color-selector/color-selector.service';
import { DrawStackService } from '../draw-stack/draw-stack.service';
import { BrushService } from '../drawable/brush/brush.service';
import { ColorApplicatorService } from '../drawable/color-applicator/color-applicator.service';
import { DrawableService } from '../drawable/drawable.service';
import { EllipseService } from '../drawable/ellipse/ellipse.service';
import { EraserService } from '../drawable/eraser/eraser.service';
import { FeatherService } from '../drawable/feather/feather.service';
import { GridService } from '../drawable/grid/grid.service';
import { LineService } from '../drawable/line/line.service';
import { PaintSealService } from '../drawable/paint-seal/paint-seal.service';
import { PencilService } from '../drawable/pencil/pencil.service';
import { PolygonService } from '../drawable/polygon/polygon.service';
import { RectangleService } from '../drawable/rectangle/rectangle.service';
import { SelectionService } from '../drawable/selection/selection.service';
import { SprayService } from '../drawable/spray/spray.service';
import { TextService } from '../drawable/text/text.service';
import { PipetteService } from '../pipette/pipette.service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';

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
  private paintSeal: PaintSealService;
  private ellipse: EllipseService;
  private eraser: EraserService;
  private pipette: PipetteService;
  private text: TextService;
  private feather: FeatherService;

  disableUndo: boolean;
  disableRedo: boolean;

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
    this.paintSeal = new PaintSealService();
    this.text = new TextService();
    this.feather = new FeatherService();

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
    this.tools.set(Tools.Bucket, this.paintSeal);
    this.tools.set(Tools.Text, this.text);
    this.tools.set(Tools.Feather, this.feather);
    this.$currentTool = new BehaviorSubject<Tools>(Tools.None);
    this.setCurrentTool(Tools.Selection);

    this.disableRedo = true;
    this.disableUndo = true;
  }

  initialize(manipulator: Renderer2, image: ElementRef<SVGElement>, colorSelectorService: ColorSelectorService,
             drawStack: DrawStackService, canvas: ElementRef<HTMLCanvasElement>): void {
    this.memory = new UndoRedoService(drawStack, manipulator, image);
    for (const element of this.tools) {
      element[1].initialize(manipulator, image, colorSelectorService, drawStack);
    }
    this.pipette.setupCanvas(canvas.nativeElement);
    this.memory.changed.subscribe(
      () => {
        if (this.memory.changed.value) {
          this.memory.changed.next(false);
          if (this.tool !== undefined) {
            this.tool.endTool();
            this.tool.onSelect();
          }
        }
      }
    );
    this.memory.undoElements.subscribe( () => {
      this.disableUndo = this.memory.undoElements.value <= 1;
    });
    this.memory.redoElements.subscribe( () => {
      this.disableRedo = this.memory.redoElements.value === 0;
    });
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
  getPaintSeal(): PaintSealService { return this.paintSeal; }
  getText(): TextService { return this.text; }
  getFeather(): FeatherService { return this.feather; }

  setCurrentTool(tool: Tools): void {
    const foundTool = this.getTool(tool);
    if (foundTool !== undefined) {
      if (this.tool !== undefined) {
        this.tool.endTool();
      }
      if (tool === Tools.Bucket) {
        this.paintSeal.assignPipette(this.pipette);
      }
      this.tool = foundTool;
      this.tool.onSelect();
      this.$currentTool.next(tool);
      this.drawerService.updateDrawer(this.$currentTool.getValue());
    } else if (tool === Tools.None) {
      if (this.tool !== undefined) {
        this.tool.endTool();
      }
      this.$currentTool.next(tool);
      this.drawerService.navIsOpened = true;
    }
  }

  getTool(toFind: Tools): DrawableService | undefined {
    if (this.tools.has(toFind)) {
      return this.tools.get(toFind);
    }
    return undefined;
  }
}
