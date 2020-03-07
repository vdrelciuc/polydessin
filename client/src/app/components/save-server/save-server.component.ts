import { Component } from '@angular/core';
import { MatDialogRef} from "@angular/material/dialog";


@Component({
  selector: 'app-save-server',
  templateUrl: './save-server.component.html',
  styleUrls: ['./save-server.component.scss']
})
export class SaveServerComponent {

  title: string;
  isValid = false;
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

  // inspired from https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript
  checkValidity(){
    for(let i = 0 ; i < this.title.length ; ++i ){
      let asci = this.title.charCodeAt(i);
      if (!(asci > 47 && asci < 58) && // numeric (0-9)
          !(asci > 64 && asci < 91) && // upper alpha (A-Z)
          !(asci > 96 && asci < 123)) { // lower alpha (a-z)
        this.isValid = false;
        return
      }
    }
    this.isValid = true;
  }
}
