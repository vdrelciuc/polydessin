import { Injectable, Renderer2 } from '@angular/core';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { Stack } from 'src/app/classes/stack';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
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

  addPointToLine(onScreenX: number, onScreenY: number): void {
    // Should make modifications
    // Screen's X and Y are not the same as the canvas'

    if (this.properties.isJunctionADot()) {
      this.manipulator.appendChild(this.currentElement, '')
    }
    this.points.push_back(new CoordinatesXY(onScreenX, onScreenY));
  }

  onBackspacePressed(): void {
    this.points.pop_back();
    this.update(false);
  }

  onDoubleClick(event: MouseEvent): void { // Should end line
    if (this.isDrawing) {
        this.isDrawing = false;
        if (!this.lineIsDone) {
          this.addPointToLine(event.clientX, event.clientY);
          this.lineIsDone = true;
        }
        this.points.clear();
    }
  }

  onEscapePressed(): void {
    this.points.clear();
    this.update(false);
  }

  onMouseInCanvas(event: MouseEvent): void {
    // Change the pointer's appearance
    this.isDrawing = true;
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.lineIsDone && this.isDrawing) {
      this.preview(event.clientX, event.clientY);
    }
  }

  onMouseOutCanvas(event: MouseEvent): void {
    // Change the pointer's appearance
    this.isDrawing = true;
  }

  onMousePress(event: MouseEvent): void {
    this.addPointToLine(event.clientX, event.clientY);
  }

  onMouseRelease(event: MouseEvent): void {
    throw new Error("Method not implemented.");
  }

  preview(x: number, y: number): void {
      this.manipulator.setAttribute(
        this.currentElement,
        SVGProperties.pointsList,
        this.printPointsStack(this.points) + this.pointToString(x, y)
      );
  }

  update(areNewPoints: boolean,
         {newPoints = this.points}: {newPoints?: Stack<CoordinatesXY>}= {}): void {
        this.manipulator.setAttribute(
          this.currentElement,
          SVGProperties.pointsList,
          this.printPointsStack(newPoints)
        );
  }

  private printPointsStack(stack: Stack<CoordinatesXY>): string {
    let returnPoints: string = '';
    for (const point of stack.getAll()) {
      returnPoints += this.pointToString(point.getX(), point.getY());
    }
    return returnPoints;
  }

  private pointToString(x: number, y: number): string { return x + ',' + y + ' '; }
}
