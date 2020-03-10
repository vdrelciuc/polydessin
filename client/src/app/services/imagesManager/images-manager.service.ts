import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Image} from "../../interfaces/image";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ImagesManagerService {

  readonly _url = "http://localhost:3000/api/images";
  constructor(private http : HttpClient) { }


  getALLImages(): Observable<Image[]>{
    return this.http.get<Image[]>(this._url);
  }

  deleteImage(id : string): Observable<void>{
    return this.http.delete<void>(`${this._url}/${id}`)
  }
}
