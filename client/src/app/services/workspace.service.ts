import { Injectable } from '@angular/core';
import * as CONSTANTS from 'src/app/classes/constants';
import { Color } from '../classes/color';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  backgroundColor: Color;

  constructor() {
    this.backgroundColor = new Color(CONSTANTS.WORKSPACE_BACKGROUND);
  }

  checkIfSameBackgroundColor(color: Color): boolean {
    return color.getHex() === this.backgroundColor.getHex();
  }
}
