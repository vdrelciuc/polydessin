import { Injectable } from '@angular/core';

const toolBoxWidth = 250 + 96;

@Injectable({
  providedIn: 'root'
})
export class CreateNewService {

  backgroundColor: number[];
  canvasSize: number[];

  constructor() { }

  getcanvasSize(axis: number): number {
    return (this.canvasSize[axis] || ((axis) ? window.innerHeight :  window.innerWidth - toolBoxWidth));
  }
  setCanvasSize(axis: number, size: number) {
    if (size > 0) {
      this.canvasSize[axis] = size;
    }
  }

}
