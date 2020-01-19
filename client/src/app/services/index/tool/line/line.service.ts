import { Injectable } from '@angular/core';
import { DrawableService } from '../../drawable/drawable.service';

@Injectable({
  providedIn: 'root'
})
export class LineService implements DrawableService {

  constructor() { }
}
