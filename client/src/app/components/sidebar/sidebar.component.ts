import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { HotkeysService } from 'src/app/services/events/shortcuts/hotkeys.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import { Tools } from '../../enums/tools';
import { ExportService } from '../../services/export/export.service';
import { ToolSelectorService } from '../../services/tools/tool-selector.service';
import { CreateNewComponent } from '../create-new/create-new.component';
import { ExportComponent } from '../export/export.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { SaveServerComponent } from '../save-server/save-server.component';
import { UserGuideComponent } from '../user-guide/user-guide.component';
import {GalleryService} from "../../services/gallery/gallery.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  currentTool: Tools;
  private subscriptions: Subscription[] = [];
  private createNewDialog: MatDialogRef<CreateNewComponent>;
  private galleryDialog: MatDialogRef<GalleryComponent>;
  private exportDialog: MatDialogRef<ExportComponent>;
  private saveServerDialog: MatDialogRef<SaveServerComponent>;

  constructor(
    public toolSelectorService: ToolSelectorService,
    private shortcut: HotkeysService,
    private exportService: ExportService,
    private drawStackService: DrawStackService,
    private snackBar: MatSnackBar,
    private galleryService : GalleryService,
    protected dialog: MatDialog) {
    this.setupShortcuts();
  }

  ngOnInit(): void {
    this.toolSelectorService.$currentTool.subscribe((tool: Tools) => {
      this.currentTool = tool;
    });
  }

  bypassBrowserShortcuts(): void {
    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.e', description: 'block search tab' }).subscribe(
      (event) => {
        // do nothing
      }
      )
    );
    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.o', description: 'bypass open to save from chrome' }).subscribe(
      (event) => {
        // do nothing
      }
      )
    );
    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.g', description: 'bypass search chrome' }).subscribe(
      (event) => {
        // do nothing
      }
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

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.a', description: 'Select all elements on canvas' }).subscribe(
      (event) => {
        if (this.toolSelectorService.$currentTool.getValue() !== Tools.Selection) {
          this.toolSelectorService.setCurrentTool(Tools.Selection);
        }
        this.toolSelectorService.getSelection().selectAllElements();
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
    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'A', description: 'Selecting spray with shortcut' }).subscribe(
        (event) => {
          this.toolSelectorService.setCurrentTool(Tools.Spray);
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'i', description: 'Selecting pipette with shortcut' }).subscribe(
      (event) => {
        this.toolSelectorService.setCurrentTool(Tools.Pipette);
      }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.o', description: 'Opening create a new drawing' }).subscribe(
        (event) => {
          this.createNewProject();
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.g', description: 'Opening gallery' }).subscribe(
      (event) => {
        this.openGallery();
      }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.s', description: 'Opening Save on Server' }).subscribe(
      (event) => {
        this.saveServerProject();
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
          const grid = this.toolSelectorService.getGrid();
          if (grid.visible) {
            grid.incrementThickness();
          }
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: '-', description: 'Grid size --' }).subscribe(
      (event) => {
        const grid = this.toolSelectorService.getGrid();
        if (grid.visible) {
          grid.decrementThickness();
        }
      }
    )
  );
  }

  selectTool(tool: Tools): void {
    this.toolSelectorService.setCurrentTool(tool);
  }

  saveServerProject(): void {
    if (this.galleryService.refToSvg.nativeElement.childElementCount > 0 ||
      !this.drawStackService.isEmpty()
    ) {
      this.prepareDialogLaunch();
      this.exportService.SVGToCanvas().then(() => {
        this.bypassBrowserShortcuts();
        this.saveServerDialog = this.dialog.open(SaveServerComponent, {disableClose: true});
        this.saveServerDialog.afterClosed().subscribe(() => {
          this.setupShortcuts();
        });
      });
    } else {
      this.snackBar.open('Vous ne pouvez pas sauvegarder un canvas vide', '', {
        duration: 2000,
      });
    }
  }

  createNewProject(): void {
    this.prepareDialogLaunch();
    this.createNewDialog = this.dialog.open(CreateNewComponent, { disableClose: true });
    this.createNewDialog.afterClosed().subscribe( () => {
      this.setupShortcuts();
    });
  }

  openGallery(): void {
    this.prepareDialogLaunch();
    this.bypassBrowserShortcuts();
    this.galleryDialog = this.dialog.open(GalleryComponent, { disableClose: true });
    this.galleryDialog.afterClosed().subscribe( () => {
      this.setupShortcuts();
    });
  }

  exportProject(): void {
    if ((this.galleryService.refToSvg.nativeElement.childElementCount >0)
      || !this.drawStackService.isEmpty()) {
      this.prepareDialogLaunch();
      this.exportService.SVGToCanvas().then(() => {
        this.bypassBrowserShortcuts();
        this.exportDialog = this.dialog.open(ExportComponent, { disableClose: true });
        this.exportDialog.afterClosed().subscribe( () => {
          this.setupShortcuts();
        });
      });
    } else {
      this.snackBar.open('Vous ne pouvez pas exporter un canvas vide', '', {
        duration: 2000,
      });
    }
  }

  openDialog(): void {
    this.dialog.open(UserGuideComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
  }

  private prepareDialogLaunch(): void {
    this.subscriptions.forEach ( (subscription) => subscription.unsubscribe() );
    this.dialog.closeAll();
  }

}
