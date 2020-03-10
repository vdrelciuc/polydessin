import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ExportService} from "../../services/export/export.service";
import {ErrorOnSaveComponent} from "./error-on-save/error-on-save.component";


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

  addTag(etiquette : string): void{
    if (this.checkValidity(etiquette)){
      this.tags.add(etiquette);
    }
    this.isValidTag = true;
  }

  removeTag(etiquette : string): void{
    this.tags.delete(etiquette);
    if (this.tags.size ===0) {
      this.isValidTag = false;
    }
  }

  // inspired from https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript
  checkValidity(field :string): boolean{
    if (field === undefined || field === '') {
      return false;
    }
    for(let i = 0 ; i < field.length ; ++i ){
      let asci = field.charCodeAt(i);
      if (!(asci > 47 && asci < 58) && // numeric (0-9)
          !(asci > 64 && asci < 91) && // upper alpha (A-Z)
          !(asci > 96 && asci < 123)) { // lower alpha (a-z)
        return false;
      }
    }

    return true;
  }
}
