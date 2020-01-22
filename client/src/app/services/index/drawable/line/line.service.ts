import { Injectable, Renderer2 } from '@angular/core';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { Stack } from 'src/app/classes/stack';
import { DrawableService } from '../drawable.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';

@Injectable({
  providedIn: 'root'
})
export class LineService extends DrawableService {

  private isDrawing: boolean; // If the user can draw
  private lineIsDone: boolean; // If the user has double clicked to endl
  private lineStarted: boolean; // If the user created the first point
  private points: Stack<CoordinatesXY>;
  private currentElement: SVGPolylineElement;
  private manipulator: Renderer2;

  constructor(private properties: DrawablePropertiesService) {
    super();
  }

  initialize(): void {
    throw new Error("Method not implemented.");
  }


  onMouseMove(event: MouseEvent): void {
    if (!this.lineIsDone && this.isDrawing) {
      this.preview(event.clientX, event.clientY);
    }
  }

  onMouseInCanvas(event: MouseEvent): void {
    // Change the pointer's appearance
    this.isDrawing = true;
  }

  onMouseOutCanvas(event: MouseEvent): void {
    // Change the pointer's appearance
    this.isDrawing = true;
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


  printPointsStack(): string {
    let returnPoints: string = '';
    for (const point of this.points.getAll()) {
      returnPoints += point.getX() + ',' + point.getY + ' ';
    }
    return returnPoints;
  }
}
