import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DrawerService } from '../../services/side-nav-drawer/drawer.service';

import { Tools } from '../../enums/tools'

@Injectable({
  providedIn: 'root'
})
export class ToolSelectorService {

  $currentTool: BehaviorSubject<Tools>;

  constructor(private drawerService: DrawerService) {
    this.$currentTool = new BehaviorSubject<Tools>(Tools.None);
  }

  setCurrentTool(tool: Tools): void {
    this.$currentTool.next(tool);
    this.drawerService.updateDrawer(this.$currentTool.getValue());
  }
}
