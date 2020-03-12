import { ElementRef, Injectable } from '@angular/core';
import { Image } from '../../interfaces/image';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  innerHtml: ElementRef<SVGElement>;

  loadImage(image: Image): void {
    console.log(this.innerHtml.nativeElement);
    console.log(image.innerHtml);
    // this.innerHtml.nativeElement.replaceWith(image.innerHtml.firstElementChild as SVGElement);
  }
}
