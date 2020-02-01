import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  backgroundColorHex: string;
  constructor() { 
    this.backgroundColorHex = '808080';
  }

  getBackgroundColorHex(): string {
    return '#'.concat(this.backgroundColorHex);
  }
  setBackgroundColorHex(colorHex: string): void {
    if(colorHex !== undefined) {
      if(colorHex.length === 6 && Number(colorHex) !== NaN) {
        this.backgroundColorHex = colorHex;
      }
    }
  }
  checkIfSameBackgroundColor(colorHex: string): boolean {
    return colorHex === this.backgroundColorHex;
  }
}
