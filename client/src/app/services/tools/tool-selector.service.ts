import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Tools } from '../../enums/tools'

@Injectable({
  providedIn: 'root'
})
export class ToolSelectorService {

  $currentTool: BehaviorSubject<Tools>;
  isHidden: boolean;

  constructor() {
    this.$currentTool = new BehaviorSubject<Tools>(Tools.Arrow);
    this.isHidden = true;
  }

  setCurrentTool(tool: Tools): void {
    this.$currentTool.next(tool);
    this.isHidden = false;
  }
}
