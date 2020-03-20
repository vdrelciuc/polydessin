import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Tools } from '../../enums/tools';
import { ToolSelectorService } from '../../services/tools/tool-selector.service';
import { WorkingAreaComponent } from '../working-area/working-area.component';
import { WarningDialogComponent } from '../create-new/warning-dialog/warning-dialog.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  currentTool: Tools;

  constructor(
    public toolSelectorService: ToolSelectorService,
    private workingAreaComponent: WorkingAreaComponent,
    public router: Router,
    protected dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.toolSelectorService.$currentTool.subscribe((tool: Tools) => {
      this.currentTool = tool;
    });
  }

  selectTool(tool: Tools): void {
    this.toolSelectorService.setCurrentTool(tool);
  }

  saveServerProject(): void {
    this.workingAreaComponent.saveServerProject();
  }

  createNewProject(): void {
    this.workingAreaComponent.createNewProject();
  }

  openGallery(): void {
    this.workingAreaComponent.openGallery();
  }

  exportProject(): void {
    this.workingAreaComponent.exportProject();
  }

  openUserGuide(): void {
    this.workingAreaComponent.openUserGuide();
  }

  goHome(): void {
    const warning = this.dialog.open(WarningDialogComponent, { disableClose: true });

    warning.afterClosed().subscribe((result) => {
      if (!result) {
        this.router.navigateByUrl('/');
      }
    });
  }

}
