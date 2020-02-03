import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateNewService {

  static toolBoxWidth = 250 + 96;
  backgroundColor: number[];
  canvasSize: number[];

  constructor() { 
    this.canvasSize = [0, 0];
  }

  getcanvasSize(axis: number): number {
    return (this.canvasSize[axis] || 
      ((axis) ? window.innerHeight :  window.innerWidth - CreateNewService.toolBoxWidth));
  }
  
  setCanvasSize(axis: number, size: number) {
    if (size > 0) {
      this.canvasSize[axis] = size;
    }
  }

}
