import { Injectable } from '@angular/core';
import { LineComponent } from 'src/app/components/app/line/line.component';
import { DrawableService } from '../drawable/drawable.service';
import { LineService } from './line/line.service';

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  tools = new Map<string, DrawableService>();

  constructor() { // Add every tool that is going to be used with it's name format (name, toolService)
      this.tools.set(LineComponent.name, LineService);
  }

  initialize(): void {
    for(const element of this.tools) {
      element.initialize();
    }
  }
}
