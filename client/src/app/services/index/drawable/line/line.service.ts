import { ElementRef, Injectable, Renderer2 } from '@angular/core';
// import { Shape } from 'src/app/classes/shape';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { Stack } from 'src/app/classes/stack';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
// import { SVGService } from '../../svg/svg.service';
import { Tools } from 'src/app/enums/tools';
import { DrawableService } from '../drawable.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';

@Injectable({
  providedIn: 'root'
})
export class LineService extends DrawableService {

  attributes: DrawablePropertiesService;
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
  private connectionDot: SVGCircleElement;
  private manipulator: Renderer2;
  private image: ElementRef<SVGElement>;
  private subElement: SVGGElement;

  constructor() {
    super();
    
  }

  static getName(): Tools { return Tools.Line; }

  initialize(manipulator: Renderer2, image: ElementRef<SVGElement>): void {
    console.log('line init');
    this.manipulator = manipulator;
    this.image = image;
  }

  initializeProperties(attributes: DrawablePropertiesService) {
    this.attributes = attributes;
    this.thickness = this.attributes.thickness.value;
    this.dotDiameter = this.attributes.dotDiameter.value;
    this.jointIsDot = this.attributes.junction.value;

    this.attributes.thickness.subscribe((element: number) => {
        this.thickness = element;
    });
    this.attributes.junction.subscribe((element) => {
        this.jointIsDot = element.toString() === 'Point';
    });
    this.attributes.dotDiameter.subscribe((element: number) => {
        this.dotDiameter = element;
    });

    this.attributes.color.subscribe((element: string) => {
      this.color = element;
    })
  }

  onMouseInCanvas(event: MouseEvent): void {
    console.log('in canvas');
  }
  onMouseOutCanvas(event: MouseEvent): void {
    console.log('out of canvas');
  }

  onMouseMove(event: MouseEvent): void {
    if(this.isStarted) {
      const previewPoints = this.pointsToString() + this.effectiveX(event.clientX).toString()
          + ',' + this.effectiveY(event.clientY).toString();
      this.manipulator.setAttribute(
          this.line,
          SVGProperties.pointsList,
          previewPoints
      );
    }
  }

  addPointToLine(onScreenX: number, onScreenY: number): void {
    this.points.push_back(new CoordinatesXY(this.effectiveX(onScreenX), this.effectiveY(onScreenY)));
    this.manipulator.setAttribute(
      this.line,
      SVGProperties.pointsList,
      this.pointsToString()
    );
    this.manipulator.setAttribute(this.line, SVGProperties.pointsList, this.pointsToString());
  }

  onMousePress(event: MouseEvent): void {
    this.addPointToLine(event.clientX, event.clientY);
  }
  onMouseRelease(event: MouseEvent): void {
    throw new Error('Method not implemented.');
  }

  onDoubleClick(event: MouseEvent): void { // Should end line
    console.log('Test: double clicked from line');
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
      this.updateProperties();
      this.points = new Stack<CoordinatesXY>();
      this.addPointToLine(event.clientX, event.clientY);
      this.isStarted = true;
    }
  }

  updateProperties(): void {
    this.subElement = this.manipulator.createElement('g', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.subElement, SVGProperties.title, Tools.Line);
    this.line = this.manipulator.createElement(SVGProperties.polyLine,'http://www.w3.org/2000/svg');

    this.manipulator.setAttribute(this.line, SVGProperties.fill, 'none');
    this.manipulator.setAttribute(this.line, SVGProperties.thickness, this.thickness.toString());
    this.manipulator.setAttribute(this.line, SVGProperties.color, this.color);
    this.manipulator.setAttribute(this.line, SVGProperties.opacity, this.opacity);

    if (this.jointIsDot) {
      this.manipulator.setAttribute(this.connectionDot, SVGProperties.radius, (this.dotDiameter / 2).toString());
      this.manipulator.setAttribute(this.connectionDot, SVGProperties.color, this.color);
      this.manipulator.setAttribute(this.connectionDot, SVGProperties.fill, this.color);
      this.manipulator.setAttribute(this.connectionDot, SVGProperties.opacity, this.opacity);
    }

    this.manipulator.appendChild(this.subElement, this.line);
    this.manipulator.appendChild(this.image.nativeElement, this.subElement);
  }

  private pointsToString({newPoints= this.points}: {newPoints?: Stack<CoordinatesXY>}= {}) {
    let pointsToString = '';
    for (const point of newPoints.getAll()) {
      pointsToString += point.getX() + ',' + point.getY() + ' ';
    }
    return pointsToString;
  }

  private effectiveX(onScreenX: number): number {
    return onScreenX - this.image.nativeElement.getBoundingClientRect().left;
  }

  private effectiveY(onScreenY: number): number {
    return onScreenY - this.image.nativeElement.getBoundingClientRect().top;
  }
}
