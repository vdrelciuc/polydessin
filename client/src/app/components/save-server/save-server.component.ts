import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-save-server',
  templateUrl: './save-server.component.html',
  styleUrls: ['./save-server.component.scss']
})
export class SaveServerComponent {

  title: string;
  tags : Set<string>;
  tagName : string;

  constructor(private dialogRef: MatDialogRef<SaveServerComponent>) {
    this.tags = new  Set<string>();
  }



  onDialogClose() {
    this.dialogRef.close();
  }

  saveConfirmation() {
    this.onDialogClose();
    console.log(this.title);
    // saving logic
  }

  addTag(etiquette : string): void{
    if (etiquette ==='') {
      return;
    }
    this.tags.add(etiquette);
    // todo add warning if has ettiquette
  }

  removeTag(etiquette : string): void{
    this.tags.delete(etiquette);
  }
}
