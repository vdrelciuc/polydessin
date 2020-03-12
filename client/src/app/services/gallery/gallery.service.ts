import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as CONSTANTS from 'src/app/classes/constants';
import { Image } from '../../interfaces/image';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  innerHtml: ElementRef<SVGElement>;

  constructor(private http: HttpClient) {
  }

  loadImage(image: Image): void {
    console.log(this.innerHtml.nativeElement);
    console.log(image.innerHtml);
  }

  getAllImages(): Observable<Image[]> {
    return this.http.get<Image[]>(CONSTANTS.REST_API_ROOT);
  }

  deleteImage(id: string): Observable<void> {
    return this.http.delete<void>(`${CONSTANTS.REST_API_ROOT}/${id}`);
  }
}
