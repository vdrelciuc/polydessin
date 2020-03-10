import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ElementRef, Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable} from 'rxjs';
import * as CONSTANTS from 'src/app/classes/constants';
import {Image} from '../../interfaces/image';

@Injectable({
  providedIn: 'root'
})
export class SaveServerService {

  readonly HTTP_STATUS_OK: number = 201;
  innerHtml: ElementRef<SVGElement>;

  constructor(private http: HttpClient,
              private snacks: MatSnackBar) {
  }

  // inspired from https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript
  checkValidity(field: string): boolean {
    if (field === undefined || field === '') {
      return false;
    }
    for (let i = 0; i < field.length; ++i) {
      const asci = field.charCodeAt(i);
      if (!(asci > 47 && asci < 58) && // numeric (0-9)
        !(asci > 64 && asci < 91) && // upper alpha (A-Z)
        !(asci > 96 && asci < 123)) { // white space
        return false;
      }
    }

    return true;
  }

  addTag(etiquette: string, data: Set<string>): boolean {
    if (this.checkValidity(etiquette)) {
      data.add(etiquette);
      return true;
    }
    return false;
  }

  removeTag(etiquette: string, data: Set<string>): void {
    data.delete(etiquette);
  }

  handleError(error: HttpErrorResponse): void {
    if (error.status === this.HTTP_STATUS_OK) {
      this.snacks.open('Votre image a été sauvegardé avec succès', '', {duration: 1500});
    } else {
      // The backend returned an unsuccessful response code.
      this.snacks.open('Une erreur de communication a occuré, votre image n\'a pas pu être sauvegardé', '', {duration: 1800});
    }
  }

  addImage(title: string, tagsSet: Set<string>, imgSrc: string): Observable<Image> {
    let tags: string[];
    tags = [];
    tagsSet.forEach((e) => {
      tags.push(e);
    });
    return this.http.post<Image>(CONSTANTS.REST_API_ROOT,
      {title, tags, serial: imgSrc, innerHtml: this.innerHtml.nativeElement}
    );
  }
}
