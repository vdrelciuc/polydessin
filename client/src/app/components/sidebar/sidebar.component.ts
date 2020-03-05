import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { HotkeysService } from 'src/app/services/events/shortcuts/hotkeys.service';
import { Tools } from '../../enums/tools';
import { ToolSelectorService } from '../../services/tools/tool-selector.service';
import { CreateNewComponent } from '../create-new/create-new.component';
import { ExportComponent } from '../export/export.component';
import { UserGuideComponent } from '../user-guide/user-guide.component';
import {ExportService} from "../../services/export/export.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  currentTool: Tools;
  private subscriptions: Subscription[] = [];
  private createNewDialog: MatDialogRef<CreateNewComponent>;
  private exportDialog: MatDialogRef<ExportComponent>;

  constructor(
    public toolSelectorService: ToolSelectorService,
    private shortcut: HotkeysService,
    private exportService : ExportService,
    protected dialog: MatDialog) {
    this.setupShortcuts();
  }

  ngOnInit() {
    this.toolSelectorService.$currentTool.subscribe((tool: Tools) => {
      this.currentTool = tool;
    });
  }

  bypassBrowserShortcuts(): void{
    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.e', description: 'block search tab' }).subscribe(
      (event) => {}
      )
    );
    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.o', description: 'bypass open to save from chrome' }).subscribe(
      (event) => {}
      )
    );
  }

  setupShortcuts(): void {
    this.subscriptions.forEach ( (subscription) => subscription.remove(subscription));
    this.subscriptions.push(this.shortcut.addShortcut({ keys: 's', description: 'Selecting selection with shortcut' }).subscribe(
        (event) => {
          this.toolSelectorService.setCurrentTool(Tools.Selection);
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'l', description: 'Selecting line with shortcut' }).subscribe(
        (event) => {
          this.toolSelectorService.setCurrentTool(Tools.Line);
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'r', description: 'Selecting color applicator with shortcut' }).subscribe(
      (event) => {
        this.toolSelectorService.setCurrentTool(Tools.ColorApplicator);
      }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'c', description: 'Selecting pencil with shortcut' }).subscribe(
        (event) => {
          this.toolSelectorService.setCurrentTool(Tools.Pencil);
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.e', description: 'open export dialog' }).subscribe(
      (event) => {
        this.subscriptions.forEach ( (subscription) => subscription.unsubscribe() );
        this.dialog.closeAll();
        this.exportProject();
      }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: '1', description: 'Selecting rectangle with shortcut' }).subscribe(
        (event) => {
          this.toolSelectorService.setCurrentTool(Tools.Rectangle);
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: '2', description: 'Selecting ellipse with shortcut' }).subscribe(
        (event) => {
          this.toolSelectorService.setCurrentTool(Tools.Ellipse);
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'w', description: 'Selecting brush with shortcut' }).subscribe(
        (event) => {
          this.toolSelectorService.setCurrentTool(Tools.Brush);
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'e', description: 'Selecting eraser with shortcut' }).subscribe(
      (event) => {
        this.toolSelectorService.setCurrentTool(Tools.Eraser);
      }
    )
  );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: '3', description: 'Selecting polygon with shortcut' }).subscribe(
        (event) => {
          this.toolSelectorService.setCurrentTool(Tools.Polygon);
        }
      )
    );
    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.o', description: 'Opening create a new drawing' }).subscribe(
        (event) => {
          this.subscriptions.forEach ( (subscription) => subscription.unsubscribe() );
          this.dialog.closeAll();
          this.createNewProject();
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.z', description: 'Undo' }).subscribe(
        (event) => {
          this.toolSelectorService.memory.undo();
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.shift.z', description: 'Redo' }).subscribe(
        (event) => {
          this.toolSelectorService.memory.redo();
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'g', description: 'Display/Undisplay grid' }).subscribe(
        (event) => {
          this.toolSelectorService.getGrid().toggle();
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: '+', description: 'Grid size ++' }).subscribe(
        (event) => {
          let grid = this.toolSelectorService.getGrid();
          if(grid.visible) {
            grid.incrementThickness();
          }
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: '-', description: 'Grid size --' }).subscribe(
      (event) => {
        let grid = this.toolSelectorService.getGrid();
        if(grid.visible) {
          grid.decrementThickness();
        }
      }
    )
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

  exportProject(): void {
    this.exportService.SVGToCanvas().then(() => {
      this.subscriptions.forEach ( (subscription) => subscription.remove(subscription));
      this.bypassBrowserShortcuts();
      this.exportDialog = this.dialog.open(ExportComponent, { disableClose: true });
      this.exportDialog.afterClosed().subscribe( () => {
        this.setupShortcuts();
      });
    });
  }

  openDialog(): void {
    this.dialog.open(UserGuideComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
  }

}
