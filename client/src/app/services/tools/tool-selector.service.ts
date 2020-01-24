import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Tools } from '../../enums/tools'
import { DrawableService } from '../index/drawable/drawable.service';
import { LineService } from '../index/drawable/line/line.service';

@Injectable({
  providedIn: 'root'
})
export class ToolSelectorService {

  $currentTool: BehaviorSubject<Tools>;
  isHidden: boolean;
  private tools: Map<Tools, DrawableService>;
  private currentTool: DrawableService;

  constructor() { // Add every tool that is going to be used with it's name format (name, toolService)
    this.tools = new Map<Tools, DrawableService>();
    this.tools.set(LineService.getName(), new LineService());

      // Initialize currentTool as the selector(mouse)
    this.initialize();
    this.$currentTool = new BehaviorSubject<Tools>(Tools.Arrow);
    this.isHidden = true;
  }

  initialize(): void {
    for (const element of this.tools) {
      element[1].initialize();
    }
  }

  getCurrentTool(): DrawableService { return this.currentTool; }

  setCurrentTool(tool: Tools): void {
    const foundTool = this.findTool(tool);
    if (foundTool !== undefined) {
      this.$currentTool.next(tool);
      this.isHidden = false;
    }
  }

  private findTool(toFind: Tools): DrawableService | undefined {
    if (this.tools.has(toFind)) {
      return this.tools.get(toFind);
    }
    return undefined;
  }
}
