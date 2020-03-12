import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Image } from '../../interfaces/image';
import { ExportService } from '../../services/export/export.service';
import { SaveServerService } from '../../services/saveServer/save-server.service';
import { ErrorOnSaveComponent } from './error-on-save/error-on-save.component';

@Component({
  selector: 'app-save-server',
  templateUrl: './save-server.component.html',
  styleUrls: ['./save-server.component.scss']
})
export class SaveServerComponent implements  AfterViewInit {

  title: string;
  isValidTitle: boolean;
  tags: Set<string>;
  tagName: string;
  isSaving: boolean;

  readonly MAX_TAGS_ALLOWED: number = 5;

  @ViewChild('mydrawing', {static: false}) canvas: ElementRef;
  @ViewChild('proccessingCanas', {static : false}) proccessingCanas: ElementRef;

  constructor(private dialogRef: MatDialogRef<SaveServerComponent>,
              private snacks: MatSnackBar,
              private dialog: MatDialog,
              private saveService: SaveServerService,
              private exportation: ExportService) {
    this.tags = new  Set<string>();
    this.tagName = '';
    this.isSaving = false;
    this.isValidTitle = false;
  }

  ngAfterViewInit(): void {
    this.exportation.originalCanvas = this.proccessingCanas.nativeElement ;
    this.exportation.canvas = this.canvas.nativeElement;

  }

  onDialogClose(): void {
    this.dialogRef.close();
  }

  saveConfirmation(): void {
    if (!this.isValidTitle) {
      const warning = this.dialog.open(ErrorOnSaveComponent, {disableClose: true});
      warning.componentInstance.errorTitle = this.isValidTitle;
    } else {
      this.addImage().then(() => {
        this.onDialogClose();
      });
    }

  }

  addTag(tag: string): void {
    if (this.tags.size < this.MAX_TAGS_ALLOWED) {
      const isTagValid = this.saveService.addTag(tag, this.tags);
      if (isTagValid) {
        this.tagName = '';
      } else {
        this.snacks.open('Étiquette invalide', '', {duration: 2000});
      }
    } else {
      this.snacks.open('Vous ne pouvez pas ajouter plus de 5 étiquettes', '', {duration: 2000});
    }
  }

  removeTag(tag: string): void {
    this.saveService.removeTag(tag, this.tags);
  }

  checkTitleValidity(title: string): boolean {
    return this.saveService.checkTitleValidity(title);
  }

  private async addImage(): Promise<void> {
    this.isSaving = true;
    this.snacks.open('Début de la sauvegarde', '', {duration : 1400} );
    this.saveService.addImage(this.title, this.tags , this.exportation.imageAfterDeserialization.src)
      .subscribe((data: Image) => {
        // do nothing
      }, (error: HttpErrorResponse) => {
        this.isSaving = false;
        this.saveService.handleError(error);
    });
  }

}
