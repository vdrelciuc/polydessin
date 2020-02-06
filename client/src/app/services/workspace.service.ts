import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  backgroundColorHex = '808080';

  getBackgroundColorHex(): string {
    return '#'.concat(this.backgroundColorHex);
  }
  setBackgroundColorHex(colorHex: string): void {
    this.backgroundColorHex = colorHex;
  }
  checkIfSameBackgroundColor(colorHex: string): boolean {
    return colorHex === this.backgroundColorHex;
  }
}
