import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Tools } from '../../enums/tools';
import { ToolSelectorService } from '../../services/tools/tool-selector.service';
import { CreateNewComponent } from '../create-new/create-new.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  currentTool: Tools;

  constructor(
    private toolSelectorService: ToolSelectorService,
    protected dialog: MatDialog
    ) { }

  ngOnInit() {
    this.toolSelectorService.$currentTool.subscribe((tool: Tools) => {
      this.currentTool = tool;
    });
  }

  selectTool(tool: Tools): void {
    console.log('Test: ' + tool + ' selected');
    this.toolSelectorService.setCurrentTool(tool);
  }

  createNewProject(): void {
    this.dialog.open(CreateNewComponent, {});
  }
}
