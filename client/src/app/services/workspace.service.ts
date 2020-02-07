import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Color } from '../classes/color';
import { Coords } from '../classes/coordinates';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  backgroundColor: Color;
  Size: BehaviorSubject<Coords> = new BehaviorSubject<Coords>(new Coords(0, 0));
  constructor() {
    this.backgroundColor = new Color('#808080');
  }

  checkIfSameBackgroundColor(color: Color): boolean {
    return color.getHex() === this.backgroundColor.getHex();
  }
}
