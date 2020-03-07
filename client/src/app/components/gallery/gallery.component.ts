import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {


  isSearchByTags : boolean;

  constructor(private dialogRef : MatDialogRef<GalleryComponent>) {
  }

  onDialogClose() {
    this.dialogRef.close();
  }

  loadConfirmation() {
    this.onDialogClose();
    //load logic goes here
  }



}
