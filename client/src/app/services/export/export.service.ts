import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  private image: ElementRef<SVGElement>;

  initialize(image: ElementRef<SVGElement>): void {
    this.image = image;
    this.image = this.image; // TODO: delete this line
  }

}
