import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Tools } from '../../enums/tools'

@Injectable({
  providedIn: 'root'
})
export class ToolSelectorService {

  $currentTool: BehaviorSubject<Tools>;

  constructor() {
    this.$currentTool = new BehaviorSubject<Tools>(Tools.Arrow);
  }

  setCurrentTool(tool: Tools): void {
    this.$currentTool.next(tool);
  }
}
