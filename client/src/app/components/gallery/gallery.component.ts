import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {SaveServerService} from "../../services/saveServer/save-server.service";
import {Image} from "../../interfaces/image";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ImagesManagerService} from "../../services/imagesManager/images-manager.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {


  isSearchByTags: boolean;
  isValidTag: boolean;
  tags: Set<string>;
  tagName: string;
  images: Image[];
  resultImages: Image[];

  constructor(private dialogRef: MatDialogRef<GalleryComponent>,
              private saveService: SaveServerService,
              private snacks: MatSnackBar,
              private imageRetriever: ImagesManagerService,
              private sanitizer: DomSanitizer
  ) {
    this.isSearchByTags = true;
    this.tags = new Set<string>();
  }

  ngOnInit(): void {
    this.imageRetriever.getALLImages()
      .subscribe(data => {
        this.images = data;
        this.resultImages = this.images;
        // bug fix to images url unsafe from https://github.com/angular/angular/issues/18950
        this.images.forEach((e) => {
          e.serial = this.sanitizer.bypassSecurityTrustResourceUrl(e.serial) as string;
        });
        this.snacks.open('Nous avons récupéré les image :)', '', {duration: 2000});
      });
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
    if (this.isValidTag) {
      this.filterWithTag();
    }
  }

  removeTag(tag: string): void {
    this.saveService.removeTag(tag, this.tags);
    this.filterWithTag();
  }

  filterWithTag(): void {
    if (this.tags.size === 0) {
      this.resultImages = this.images;
      return;
    }
    this.resultImages = [];
    // could have used a forEach but would add the same image more than one time if it has more
    // than one corresponding ticket because u cant break a foreach loop in typescript
    for (let i = 0; i < this.images.length; i++) {
      for (let j = 0; j < this.images[i].tags.length; j++) {
        if (this.tags.has(this.images[i].tags[j])) {
          this.resultImages.push(this.images[i]);
          break;
        }
      }
    }

    if (this.resultImages.length === 0) {
      this.snacks.open('Aucun dessin correspond a votre recherche ', '', {duration: 3000});
    }
  }

}
