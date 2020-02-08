import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { HotkeysService } from 'src/app/services/events/shortcuts/hotkeys.service';
import { Tools } from '../../enums/tools';
import { ToolSelectorService } from '../../services/tools/tool-selector.service';
import { CreateNewComponent } from '../create-new/create-new.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  currentTool: Tools;
  private subscriptions: Subscription[] = [];
  private createNewDialog: MatDialogRef<CreateNewComponent>;

  constructor(
    private toolSelectorService: ToolSelectorService,
    private shortcut: HotkeysService,
    protected dialog: MatDialog) {
      this.setupShortcuts();
    }

  ngOnInit() {
    this.toolSelectorService.$currentTool.subscribe((tool: Tools) => {
      this.currentTool = tool;
    });
  }

  setupShortcuts(): void {
    this.shortcut.addShortcut({ keys: 'l', description: 'Selecting line with shortcut' }).subscribe(
      (event) => {
        this.toolSelectorService.setCurrentTool(Tools.Line);
      }
    );

    this.shortcut.addShortcut({ keys: 'c', description: 'Selecting pencil with shortcut' }).subscribe(
      (event) => {
        this.toolSelectorService.setCurrentTool(Tools.Pencil);
      }
    );

    this.shortcut.addShortcut({ keys: '1', description: 'Selecting rectangle with shortcut' }).subscribe(
      (event) => {
        this.toolSelectorService.setCurrentTool(Tools.Rectangle);
      }
    );

    this.shortcut.addShortcut({ keys: 'w', description: 'Selecting brush with shortcut' }).subscribe(
      (event) => {
        this.toolSelectorService.setCurrentTool(Tools.Brush);
      }
    );
  }

  selectTool(tool: Tools): void {
    this.toolSelectorService.setCurrentTool(tool);
  }

  createNewProject(): void {
    this.subscriptions.forEach ( (subscription) => subscription.unsubscribe() );
    this.createNewDialog = this.dialog.open(CreateNewComponent, { disableClose: true });
    this.createNewDialog.afterClosed().subscribe( () => {
      this.setupShortcuts();
    });
  }

}
