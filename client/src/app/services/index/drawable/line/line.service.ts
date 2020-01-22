import { Injectable, Renderer2 } from '@angular/core';
import { DrawableService } from '../drawable.service';
import { Stack } from 'src/app/classes/stack';
import { Shape } from 'src/app/classes/shape';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { SVGService } from '../../svg/svg.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';

@Injectable({
  providedIn: 'root'
})
export class LineService extends DrawableService {

  private isDrawing: boolean;
  private lineIsDone: boolean;
  private lineStarted: boolean;
  private points: Stack<CoordinatesXY>;
  private currentElement: SVGPolylineElement;
  private manipulator: Renderer2

  constructor(private properties: DrawablePropertiesService) {
    super();
  }

  initialize(): void {
    throw new Error("Method not implemented.");
  }


  onMouseMove(event: MouseEvent): void {
    if (!this.lineIsDone) {
      this.preview(event.clientX, event.clientY);
    }
  }

  onMouseInCanvas(event: MouseEvent): void {
    // Change the pointer's appearance
    throw new Error("Method not implemented.");
  }

  onMouseOutCanvas(event: MouseEvent): void {
    // Change the pointer's appearance
    throw new Error("Method not implemented.");
  }

  addPointToLine(onScreenX: number, onScreenY: number): void {

    // Should make modifications
    // Screen's X and Y are not the same as the canvas'

    if (this.properties.isJunctionADot()) {
      if (!this.lineStarted) {
        this.currentElement = this.manipulator.createElement('g');
      }
      this.manipulator.appendChild(this.currentElement, '')
    }
    this.points.push_back(new CoordinatesXY(onScreenX, onScreenY));
  }

  onMousePress(event: MouseEvent): void {
    this.addPointToLine(event.clientX, event.clientY);
  }
  onMouseRelease(event: MouseEvent): void {
    throw new Error("Method not implemented.");
  }

  onDoubleClick(event: MouseEvent): void { // Should end line
    if (this.isDrawing) {
        this.isDrawing = false;
        if (!this.lineIsDone) {
          this.addPointToLine(event.clientX, event.clientY);
          this.lineIsDone = true;
        }
        this.currentStack.addElement()
        this.points.clear();
    }
  }

  preview(x: number, y: number): void {
      this.manipulator.setAttribute(this.currentElement, )
  }


}
