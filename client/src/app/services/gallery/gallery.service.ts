import {ElementRef, Injectable} from '@angular/core';
import {Image} from "../../interfaces/image";

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  innerHtml: ElementRef<SVGElement>;

  constructor() { }

  loadImage(image  : Image){
    console.log(this.innerHtml);
    this.innerHtml.nativeElement = image.innerHtml as unknown as SVGElement;
    console.log(image.innerHtml as unknown as SVGElement);
  }
}
