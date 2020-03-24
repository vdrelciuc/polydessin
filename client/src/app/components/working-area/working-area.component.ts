import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ExportService } from 'src/app/services/export/export.service';
import { GalleryService } from 'src/app/services/gallery/gallery.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { DrawerService } from '../../services/side-nav-drawer/drawer.service';
import { CreateNewComponent } from '../create-new/create-new.component';
import { ExportComponent } from '../export/export.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { SaveServerComponent } from '../save-server/save-server.component';
import { UserGuideComponent } from '../user-guide/user-guide.component';

@Component({
  selector: 'app-working-area',
  templateUrl: './working-area.component.html',
  styleUrls: ['./working-area.component.scss']
})
export class WorkingAreaComponent implements OnInit {

  private createNewDialog: MatDialogRef<CreateNewComponent>;
  private galleryDialog: MatDialogRef<GalleryComponent>;
  private exportDialog: MatDialogRef<ExportComponent>;
  private saveServerDialog: MatDialogRef<SaveServerComponent>;

  constructor(
    private drawerService: DrawerService,
    private exportService: ExportService,
    private snackBar: MatSnackBar,
    private galleryService: GalleryService,
    private shortcutManager: ShortcutManagerService,
    public route: Router,
    protected dialog: MatDialog) {
      this.shortcutManager.setWorkingAreaComponent(this);
      this.shortcutManager.setupShortcuts();
  }

  ngOnInit(): void {
    if (history.state.goingToGallery) {
      this.openGallery();
    } else if (history.state.comingFromEntryPoint) {
      this.createNewProject();
    }
  }

  prepareWorkingAreaShortcuts(): void {
    this.shortcutManager.setWorkingAreaComponent(this);
    this.shortcutManager.setupShortcuts();
    this.shortcutManager.loadSavedTool();
  }

  getDrawerStatus(): boolean {
    return this.drawerService.navIsOpened;
  }

  saveServerProject(): void {
    if (this.galleryService.refToSvg.nativeElement.childElementCount > 1) {
      this.prepareDialogLaunch();
      this.exportService.SVGToCanvas().then(() => {
        this.saveServerDialog = this.dialog.open(SaveServerComponent, {disableClose: true});
        this.saveServerDialog.afterClosed().subscribe(() => {
          this.prepareWorkingAreaShortcuts();
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
      this.prepareWorkingAreaShortcuts();
    });
  }

  openGallery(): void {
    this.prepareDialogLaunch();
    this.galleryDialog = this.dialog.open(GalleryComponent, { disableClose: true });
    this.galleryDialog.afterClosed().subscribe( () => {
      this.prepareWorkingAreaShortcuts();
    });
  }

  exportProject(): void {
    if (this.galleryService.refToSvg.nativeElement.childElementCount > 1) {
      this.prepareDialogLaunch();
      this.exportService.SVGToCanvas().then(() => {
        this.exportDialog = this.dialog.open(ExportComponent, { disableClose: true });
        this.exportDialog.afterClosed().subscribe( () => {
          this.prepareWorkingAreaShortcuts();
        });
      });
    } else {
      this.snackBar.open('Vous ne pouvez pas exporter un canvas vide', '', {
        duration: 2000,
      });
    }
  }

  openUserGuide(): void {
    this.prepareDialogLaunch();
    this.dialog.open(UserGuideComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
  }

  private prepareDialogLaunch(): void {
    this.shortcutManager.saveCurrentTool();
    this.dialog.closeAll();
  }

}
