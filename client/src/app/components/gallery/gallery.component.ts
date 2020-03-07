import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {SaveServerService} from "../../services/saveServer/save-server.service";

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {


  isSearchByTags: boolean;
  isValidTag: boolean;
  tags: Set<string>;
  tagName: string;

  constructor(private dialogRef: MatDialogRef<GalleryComponent>,
              private saveService: SaveServerService) {
    this.isSearchByTags = true;
    this.tags = new  Set<string>();

  }

  onDialogClose() {
    this.dialogRef.close();
  }

  loadConfirmation() {
    this.onDialogClose();
    //load logic goes here
  }

  addTag(tag: string): void {
    this.isValidTag = this.saveService.addTag(tag, this.tags);
  }

  removeTag(tag: string): void {
    this.isValidTag = this.saveService.removeTag(tag, this.tags);
  }


}
