import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as CONSTANTS from 'src/app/classes/constants';
import { Image } from '../../interfaces/image';
import {SVGProperties} from "../../classes/svg-properties";

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  refToSvg: ElementRef<SVGElement>;

  constructor(private http: HttpClient) {
  }

  loadImage(image: Image): void {


    this.refToSvg.nativeElement.setAttribute(SVGProperties.width, image.width as unknown as string);
    this.refToSvg.nativeElement.setAttribute(SVGProperties.height, image.height as unknown as string);
    this.refToSvg.nativeElement.style.backgroundColor = image.background;
    this.refToSvg.nativeElement.innerHTML = image.innerHtml;



  }

  getAllImages(): Observable<Image[]> {
    return this.http.get<Image[]>(CONSTANTS.REST_API_ROOT);
  }

  deleteImage(id: string): Observable<void> {
    return this.http.delete<void>(`${CONSTANTS.REST_API_ROOT}/${id}`);
  }
}
