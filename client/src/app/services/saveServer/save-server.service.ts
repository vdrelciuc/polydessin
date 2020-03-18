import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import * as CONSTANTS from 'src/app/classes/constants';
import { Image } from '../../interfaces/image';
import {SVGProperties} from "../../classes/svg-html-properties";

@Injectable({
  providedIn: 'root'
})
export class SaveServerService {

  private readonly REGEX_TITLE: RegExp = /^[A-Za-z0-9- ]{3,16}$/; // Alphanumeric, space and dash: 3 to 16 chars
  private readonly REGEX_TAG: RegExp = /^[A-Za-z0-9]{1,10}$/; // Alphanumeric, 1 to 10 chars
  private readonly HTTP_STATUS_OK: number = 201;
  private innerHtml: string;
  refToSvg: ElementRef<SVGElement>;

  constructor(
    private http: HttpClient,
    private snacks: MatSnackBar) {
      this.innerHtml = '';
  }

  checkTitleValidity(title: string): boolean {
    return this.REGEX_TITLE.test(title);
  }

  addTag(etiquette: string, data: Set<string>): boolean {
    if (this.checkTagValidity(etiquette)) {
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
    this.innerHtml = this.refToSvg.nativeElement.outerHTML;
    tags = [];
    tagsSet.forEach((e) => {
      tags.push(e);
    });
    return this.http.post<Image>(CONSTANTS.REST_API_ROOT,
      {title, tags, serial: imgSrc, innerHtml: this.innerHtml,
        width: this.refToSvg.nativeElement.getAttribute(SVGProperties.width),
        height:this.refToSvg.nativeElement.getAttribute(SVGProperties.height),
        background: this.refToSvg.nativeElement.style.backgroundColor
      }
    );
  }

  private checkTagValidity(tag: string): boolean {
    return this.REGEX_TAG.test(tag);
  }
}
