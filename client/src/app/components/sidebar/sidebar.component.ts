import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import { Tools } from '../../enums/tools';
import { ExportService } from '../../services/export/export.service';
import { GalleryService } from '../../services/gallery/gallery.service';
import { ToolSelectorService } from '../../services/tools/tool-selector.service';
import { CreateNewComponent } from '../create-new/create-new.component';
import { ExportComponent } from '../export/export.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { SaveServerComponent } from '../save-server/save-server.component';
import { UserGuideComponent } from '../user-guide/user-guide.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  currentTool: Tools;
  private createNewDialog: MatDialogRef<CreateNewComponent>;
  private galleryDialog: MatDialogRef<GalleryComponent>;
  private exportDialog: MatDialogRef<ExportComponent>;
  private saveServerDialog: MatDialogRef<SaveServerComponent>;

  constructor(
    public toolSelectorService: ToolSelectorService,
    private exportService: ExportService,
    private drawStackService: DrawStackService,
    private snackBar: MatSnackBar,
    private galleryService: GalleryService,
    private shortcutManager: ShortcutManagerService,
    protected dialog: MatDialog) {
    this.shortcutManager.setSidebarComponent(this);
    this.shortcutManager.setupShortcuts();
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
    if (this.galleryService.refToSvg.nativeElement.childElementCount > 0 ||
      !this.drawStackService.isEmpty()
    ) {
      this.prepareDialogLaunch();
      this.exportService.SVGToCanvas().then(() => {
        // this.shortcutManager.bypassBrowserShortcuts();
        this.saveServerDialog = this.dialog.open(SaveServerComponent, {disableClose: true});
        this.saveServerDialog.afterClosed().subscribe(() => {
          //this.shortcutManager.setupShortcuts();
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
      //this.shortcutManager.setupShortcuts();
    });
  }

  openGallery(): void {
    this.prepareDialogLaunch();
    //this.shortcutManager.bypassBrowserShortcuts();
    this.galleryDialog = this.dialog.open(GalleryComponent, { disableClose: true });
    this.galleryDialog.afterClosed().subscribe( () => {
      //this.shortcutManager.setupShortcuts();
    });
  }

  exportProject(): void {
    if ((this.galleryService.refToSvg.nativeElement.childElementCount > 0)
      || !this.drawStackService.isEmpty()) {
      this.prepareDialogLaunch();
      this.exportService.SVGToCanvas().then(() => {
        //this.shortcutManager.bypassBrowserShortcuts();
        this.exportDialog = this.dialog.open(ExportComponent, { disableClose: true });
        this.exportDialog.afterClosed().subscribe( () => {
          //this.shortcutManager.setupShortcuts();
        });
      });
    } else {
      this.snackBar.open('Vous ne pouvez pas exporter un canvas vide', '', {
        duration: 2000,
      });
    }
  }

  openDialog(): void {
    this.prepareDialogLaunch();
    this.dialog.open(UserGuideComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
  }

  private prepareDialogLaunch(): void {
    // this.shortcutManager.disableShortcuts();
    this.dialog.closeAll();
  }

}
