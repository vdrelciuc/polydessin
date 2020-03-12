import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Image } from '../../interfaces/image';
import { GalleryService } from '../../services/gallery/gallery.service';
import { SaveServerService } from '../../services/saveServer/save-server.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  isValidTag: boolean;
  tags: Set<string>;
  tagName: string;
  images: Image[];
  resultImages: Image[];
  hoveredIndex: number;

  readonly TILE_WIDTH_PX: number = 250;

  constructor(private dialogRef: MatDialogRef<GalleryComponent>,
              private saveService: SaveServerService,
              private snacks: MatSnackBar,
              private sanitizer: DomSanitizer,
              private galleryService: GalleryService
  ) {
    this.tags = new Set<string>();
    /* tslint:disable-next-line: no-magic-numbers */
    this.hoveredIndex = -1;
    this.resultImages = [];
  }

  ngOnInit(): void {
    this.galleryService.getAllImages()
      .subscribe((data) => {
        this.images = data;
        this.resultImages = this.images;
        // bug fix to images url unsafe from https://github.com/angular/angular/issues/18950
        this.images.forEach((e) => {
          e.serial = this.sanitizer.bypassSecurityTrustResourceUrl(e.serial) as string;
        });
        this.snacks.open('Nous avons récupéré les images', '', {duration: 2000});
      });
  }

  onDialogClose(): void {
    this.dialogRef.close();
  }

  loadConfirmation(): void {
    this.onDialogClose();
    // load logic goes here
  }

  addTag(tag: string): void {
    this.isValidTag = this.saveService.addTag(tag, this.tags);
    if (this.isValidTag) {
      this.filterWithTag();
      this.tagName = '';
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
    /* tslint:disable-next-line: prefer-for-of */
    for (let i = 0; i < this.images.length; i++) {
      /* tslint:disable-next-line: prefer-for-of */
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

  deleteImage(id: string): void {
    this.galleryService.deleteImage(id).subscribe((data) => {
      for (let i = 0 ; i < this.images.length ; ++i) {
        if (id === this.images[i]._id) {
          // on supprime l'élément de notre copie du serveur
          this.images.splice(i, 1);
        }
      }
      for (let i = 0 ; i < this.resultImages.length ; ++i) {
        if (id === this.resultImages[i]._id) {
          // on supprime l'élément de notre liste de resultats temporaire
          this.resultImages.splice(i, 1);
        }
      }
      this.snacks.open('Votre image a été supprimée du serveur', '', {duration: 1500});
    }, (error) => {
      this.snacks.open('Une erreur empêche la suppression', '', {duration: 2500});
    })
    ;
  }

  loadImage(image: Image): void {
    this.galleryService.loadImage(image);
  }

  getTableWidth(): string {
    const width = this.resultImages.length / 2 * this.TILE_WIDTH_PX;
    return width + 'px';
  }

  onMouseEnter(index: number): void {
    this.hoveredIndex = index;
  }

  onMouseLeave(): void {
    /* tslint:disable-next-line: no-magic-numbers */
    this.hoveredIndex = -1;
  }

  formatTagsArray(tags: string[]): string {
    let list = '';
    for (let i = 0; i < tags.length; i++) {
      if (i === 0) {
        list = tags[i];
      } else {
        list = list + ', ' + tags[i];
      }
    }
    return 'tags : ' + list;
  }
}
