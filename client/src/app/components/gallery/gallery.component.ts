import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {SaveServerService} from "../../services/saveServer/save-server.service";
import {Image} from "../../interfaces/image";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ImagesManagerService} from "../../services/imagesManager/images-manager.service";
import {DomSanitizer} from "@angular/platform-browser";
import {GalleryService} from "../../services/gallery/gallery.service";

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {


  //isSearchByTags: boolean;
  isValidTag: boolean;
  tags: Set<string>;
  tagName: string;
  images: Image[];
  resultImages: Image[];

  constructor(private dialogRef: MatDialogRef<GalleryComponent>,
              private saveService: SaveServerService,
              private snacks: MatSnackBar,
              private imageRetriever: ImagesManagerService,
              private sanitizer: DomSanitizer,
              private galleryService : GalleryService
  ) {
    // this.isSearchByTags = true;
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
        this.snacks.open('Nous avons récupéré les images', '', {duration: 2000});
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
      this.tagName = '';
    }
  }

  removeTag(tag: string): void {
    this.isValidTag = this.saveService.removeTag(tag, this.tags);
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
      this.snacks.open('Aucun dessin correspond a votre recherche', '', {duration: 3000});
    }
  }

  deleteImage(id : string):void{
    this.imageRetriever.deleteImage(id).subscribe((data)=>{
      for (let i = 0 ; i < this.images.length ; ++i){
        if (id === this.images[i]._id){
          //on supprime l'élément de notre copie du serveur
          this.images.splice(i,1);
        }
      }
      for (let i = 0 ; i < this.resultImages.length ; ++i){
        if (id === this.resultImages[i]._id){
          //on supprime l'élément de notre liste de resultats temporaire
          this.resultImages.splice(i,1);
        }
      }
    })
  }

  loadImage(image : Image){
    this.galleryService.loadImage(image);
  }
}
