import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tools } from '../../enums/tools'
import { DrawerService } from '../../services/side-nav-drawer/drawer.service';
import { ColorSelectorService } from '../color-selector.service';
import { BrushService } from '../index/drawable/brush/brush.service';
import { DrawableService } from '../index/drawable/drawable.service';
import { LineService } from '../index/drawable/line/line.service';
import { PencilService } from '../index/drawable/pencil/pencil.service';
import { RectangleService } from '../index/drawable/rectangle/rectangle.service';
import { DrawStackService } from './draw-stack/draw-stack.service';
import { UndoRedoService } from './undo-redo/undo-redo.service';
import { EllipseService } from '../index/drawable/ellipse/ellipse.service';
import { EraserService } from '../index/drawable/eraser/eraser.service';

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
  private ellipse: EllipseService;
  private eraser: EraserService;

  constructor(private drawerService: DrawerService) { // Add every tool that is going to be used with it's name format (name, toolService)
    this.tools = new Map<Tools, DrawableService>();
    this.line = new LineService();
    this.pencil = new PencilService();
    this.rectangle = new RectangleService();
    this.brush = new BrushService();
    this.ellipse = new EllipseService();
    this.eraser = new EraserService();

    this.tools.set(Tools.Line, this.line);
    this.tools.set(Tools.Pencil, this.pencil);
    this.tools.set(Tools.Rectangle, this.rectangle);
    this.tools.set(Tools.Brush, this.brush);
    this.tools.set(Tools.Ellipse, this.ellipse);
    this.tools.set(Tools.Eraser, this.eraser);
    this.$currentTool = new BehaviorSubject<Tools>(Tools.Selection);
  }

  initialize(manipulator: Renderer2, image: ElementRef<SVGElement>, colorSelectorService: ColorSelectorService, drawStack: DrawStackService): void {
    this.memory = new UndoRedoService(drawStack, manipulator, image)
    for (const element of this.tools) {
      element[1].initialize(manipulator, image, colorSelectorService, drawStack);
    }
  }

  getCurrentTool(): DrawableService | undefined { return this.tool; }

  getLine(): LineService { return this.line; }
  getPencil(): PencilService { return this.pencil; }
  getRectangle(): RectangleService { return this.rectangle; }
  getBrush(): BrushService { return this.brush; }
  getEllipse(): EllipseService { return this.ellipse; }
  getEraser(): EraserService { return this.eraser; }

  setCurrentTool(tool: Tools): void {
    const foundTool = this.getTool(tool);
    if (foundTool !== undefined) {
      this.tool = foundTool;
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
