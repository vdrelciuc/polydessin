import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class DrawableService {

  abstract initialize(): void;
}
