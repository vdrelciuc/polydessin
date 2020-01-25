import { Component, OnInit } from '@angular/core';
import { Tools } from '../../enums/tools';
import { ToolSelectorService } from '../../services/tools/tool-selector.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  currentTool: Tools;

  constructor(private toolSelectorService: ToolSelectorService) { }

  ngOnInit() {
    this.toolSelectorService.currentToolName.subscribe((tool: Tools) => {
      this.currentTool = tool;
    });
  }

  selectTool(tool: Tools): void {
    console.log('Test: ' + tool + ' selected');
    this.toolSelectorService.setCurrentTool(tool);
  }

}
