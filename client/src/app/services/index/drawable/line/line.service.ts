import { Injectable, Renderer2 } from '@angular/core';
// import { Shape } from 'src/app/classes/shape';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { Stack } from 'src/app/classes/stack';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
// import { SVGService } from '../../svg/svg.service';
import { Tools } from 'src/app/enums/tools';
import { DrawableService } from '../drawable.service';

@Injectable({
  providedIn: 'root'
})
export class LineService extends DrawableService {

  thickness: number;
  jointIsDot: boolean;
  dotDiameter: number;
  color: string;
  opacity: string;
  private isDrawing: boolean;
  private isDone: boolean;
  private isStarted: boolean;
  private points: Stack<CoordinatesXY>;
  private line: SVGPolylineElement;
  // private lineWrapper: SVGGElement;
  private connectionDot: SVGCircleElement;
  private manipulator: Renderer2;

  constructor() {
    super();
  }

  static getName(): Tools { return Tools.Line; }

  initialize(): void {
    console.log('Init line');
  }
  onMouseInCanvas(event: MouseEvent): void {
    throw new Error('Method not implemented.');
  }
  onMouseOutCanvas(event: MouseEvent): void {
    throw new Error('Method not implemented.');
  }

  addPointToLine(onScreenX: number, onScreenY: number): void {

    // Should make modifications
    // Screen's X and Y are not the same as the canvas'

    this.points.push_back(new CoordinatesXY(onScreenX, onScreenY));
    this.manipulator.setAttribute(
      this.line,
      SVGProperties.pointsList,
      this.pointsToString()
    );
  }

  onMousePress(event: MouseEvent): void {
    this.addPointToLine(event.clientX, event.clientY);
  }
  onMouseRelease(event: MouseEvent): void {
    throw new Error('Method not implemented.');
  }

  onDblClick(event: MouseEvent): void { // Should end line
    console.log('double clicked');
    if (this.isDrawing) {
        if (!this.isDone) {
          this.addPointToLine(event.clientX, event.clientY);
          this.isDone = true;
        }
        // Send the line to the whole image to be pushed
        this.points.clear();
        this.isDrawing = false;
    }
  }

  onClick(event: MouseEvent): void {
    console.log('clicked');
    if (this.isStarted) {
      this.addPointToLine(event.clientX, event.clientY);
    } else {
      this.line = this.manipulator.createElement(
        SVGProperties.polyLine,
        'http://www.w3.org/2000/svg'
      );
      this.addPointToLine(event.clientX, event.clientY);
      this.updateProperties();
    }
  }

  private updateProperties(): void {
    this.manipulator.setAttribute(this.line, SVGProperties.fill, 'none');
    this.manipulator.setAttribute(this.line, SVGProperties.thickness, this.thickness.toString());
    this.manipulator.setAttribute(this.line, SVGProperties.color, this.color);
    this.manipulator.setAttribute(this.line, SVGProperties.fill, this.color);
    this.manipulator.setAttribute(this.line, SVGProperties.opacity, this.opacity);

    if (this.jointIsDot) {
      this.manipulator.setAttribute(this.connectionDot, SVGProperties.radius, (this.dotDiameter / 2).toString());
      this.manipulator.setAttribute(this.connectionDot, SVGProperties.color, this.color);
      this.manipulator.setAttribute(this.connectionDot, SVGProperties.fill, this.color);
      this.manipulator.setAttribute(this.connectionDot, SVGProperties.opacity, this.opacity);
    }
  }

  private pointsToString({newPoints= this.points}: {newPoints?: Stack<CoordinatesXY>}= {}) {
    let pointsToString = '';
    for (const point of newPoints.getAll()) {
      pointsToString += point.getX() + ',' + point.getY() + ' ';
    }
    return pointsToString;
  }

}
