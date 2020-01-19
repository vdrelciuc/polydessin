import { Injectable } from '@angular/core';
import { DrawableService } from '../drawable/drawable.service';
import { LineService } from './line/line.service';

@Injectable({
  providedIn: 'root'
})

export class ToolService {

  private tools: Map<string, DrawableService>;
  private currentTool: DrawableService;

  constructor() { // Add every tool that is going to be used with it's name format (name, toolService)
    this.tools = new Map<string, DrawableService>();
    this.tools.set(LineService.serviceName, new LineService());

      // Initialize currentTool as the selector(mouse)
    this.initialize();
  }

  initialize(): void {
    for (const element of this.tools) {
      element[1].initialize();
    }
  }

  getTool(toFind: string): DrawableService | undefined {
    if (this.tools.has(toFind)) {
      return this.tools.get(toFind);
    }
    return undefined;
  }

  getCurrentTool(): DrawableService { return this.currentTool; }

  setCurrentTool(toSet: string): void  {
    const foundTool = this.getTool(toSet);
    if (foundTool !== undefined) {
      this.currentTool = foundTool;
    }
  }
}
