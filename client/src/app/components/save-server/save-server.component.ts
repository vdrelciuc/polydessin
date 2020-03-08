import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ExportService} from "../../services/export/export.service";
import {ErrorOnSaveComponent} from "./error-on-save/error-on-save.component";
import {SaveServerService} from "../../services/saveServer/save-server.service";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'app-save-server',
  templateUrl: './save-server.component.html',
  styleUrls: ['./save-server.component.scss']
})
export class SaveServerComponent implements  AfterViewInit{

  title: string;
  isValidTitle = false;
  isValidTag = false;
  tags : Set<string>;
  tagName : string;
  isSaving: boolean;

  @ViewChild('mydrawing', {static: false}) canvas: ElementRef;
  @ViewChild('proccessingCanas', {static : false}) proccessingCanas: ElementRef;

  constructor(private dialogRef: MatDialogRef<SaveServerComponent>,
              private snacks : MatSnackBar,
              private dialog: MatDialog,
              private saveService : SaveServerService,
              private exportation : ExportService) {
    this.tags = new  Set<string>();
    this.isSaving = false;

  }

  ngAfterViewInit() {
    this.exportation.originalCanvas = this.proccessingCanas.nativeElement ;
    this.exportation.canvas = this.canvas.nativeElement;

  }

  onDialogClose() {
    this.dialogRef.close();
  }

  saveConfirmation() {
    if (!this.isValidTitle) {
      const warning = this.dialog.open(ErrorOnSaveComponent, {disableClose: true});
      warning.componentInstance.errorTitle = this.isValidTitle;
      warning.componentInstance.errorTag = this.isValidTag;
    } else {
      this.addImage().then(() => {
        this.onDialogClose();
      });
    }

  }

  addTag(tag: string) : void{
    this.isValidTag = this.saveService.addTag(tag, this.tags);
  }

  removeTag(tag : string) : void {
    this.isValidTag = this.saveService.removeTag(tag, this.tags);
  }

  checkValidity(tag : string) : boolean{
   return  this.saveService.checkValidity(tag);
  }



   private async addImage() {
    this.isSaving =true;
    this.snacks.open('Début de la sauvegarde', '', {duration : 2500} );
    this.saveService.addImage(this.title, this.tags , this.exportation.imageAfterDeserialization.src).then(() => {
      this.isSaving = false;
      this.snacks.open('Votre image a été sauvegardé avec succès', '', {duration : 2500} );
    }).catch(()=>{
        //todo show modal failure save
        this.isSaving = false;
        this.snacks.open('Une erreur est survenue lors de la sauvegarde', '', {duration : 2500} );
    })
  }



}
