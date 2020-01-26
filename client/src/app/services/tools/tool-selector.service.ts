import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Tools } from '../../enums/tools'
import { DrawableService } from '../index/drawable/drawable.service';
import { LineService } from '../index/drawable/line/line.service';
import { PenService } from '../index/drawable/pencil/pencil.service';
import { BrushService } from '../index/drawable/brush/brush.service';

@Injectable({
  providedIn: 'root'
})
export class ToolSelectorService {

  private toolName: BehaviorSubject<Tools> = new BehaviorSubject(Tools.Arrow);
  currentToolName: Observable<Tools> = this.toolName.asObservable();
  $currentTool: DrawableService | undefined;
  isHidden: boolean;
  private tools: Map<Tools, DrawableService>;
  private currentTool: DrawableService;
  private line: LineService;
  private pencil: PenService;
  private brush: BrushService;


  constructor() { // Add every tool that is going to be used with it's name format (name, toolService)
    this.tools = new Map<Tools, DrawableService>();
    this.line = new LineService();
    this.pencil = new PenService();
    this.brush = new BrushService();
    
    this.tools.set(Tools.Line, this.line);
    this.tools.set(Tools.Pencil, this.pencil);
    this.tools.set(Tools.Brush, this.brush);
      // Initialize currentTool as the selector(mouse)
    this.isHidden = true;
  }

  initialize(manipulator: Renderer2, image: ElementRef<SVGElement>): void {
    for (const element of this.tools) {
      element[1].initialize(manipulator, image);
    }
  }

  getCurrentTool(): DrawableService { return this.currentTool; }

  getLine(): LineService { return this.line; }
  getPencil(): PenService { return this.pencil; }
  getBrush(): BrushService { return this.brush; }

  setCurrentTool(tool: Tools): void {
    const foundTool = this.getTool(tool);
    if (foundTool !== undefined) {
      this.currentTool = foundTool;
      this.toolName.next(tool);
      console.log(tool + ' has been selected');
      this.isHidden = false;
    }
  }

  getTool(toFind: Tools): DrawableService | undefined {
    if (this.tools.has(toFind)) {
      return this.tools.get(toFind);
    }
    return undefined;
  }
}
