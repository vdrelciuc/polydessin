import { Injectable } from '@angular/core';
import { DrawableService } from '../../drawable/drawable.service';

@Injectable({
  providedIn: 'root'
})
export class LineService extends DrawableService {

  static serviceName: string = 'Line';
  initialize(): void {
    console.log('just a test - line');
  }

  constructor() {
    super();
  }
}
