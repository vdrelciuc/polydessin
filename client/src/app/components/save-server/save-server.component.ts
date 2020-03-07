import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ExportService} from "../../services/export/export.service";
import {ErrorOnSaveComponent} from "./error-on-save/error-on-save.component";
import {SaveServerService} from "../../services/saveServer/save-server.service";


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

  @ViewChild('mydrawing', {static: false}) canvas: ElementRef;
  @ViewChild('proccessingCanas', {static : false}) proccessingCanas: ElementRef;

  constructor(private dialogRef: MatDialogRef<SaveServerComponent>,
              private dialog: MatDialog,
              private saveService : SaveServerService,
              private exportation : ExportService) {
    this.tags = new  Set<string>();
  }

  ngAfterViewInit() {
    this.exportation.originalCanvas = this.proccessingCanas.nativeElement ;
    this.exportation.canvas = this.canvas.nativeElement;

  }

  onDialogClose() {
    this.dialogRef.close();
  }

  saveConfirmation() {
    if (!this.isValidTitle || !this.isValidTag) {
      const warning = this.dialog.open(ErrorOnSaveComponent, {disableClose: true});
      warning.componentInstance.errorTitle = this.isValidTitle;
      warning.componentInstance.errorTag = this.isValidTag;
    } else {
      this.onDialogClose();
      console.log(this.title);
      // saving logic
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


}
