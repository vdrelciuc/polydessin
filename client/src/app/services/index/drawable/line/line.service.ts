import { Coords } from 'src/app/classes/coordinates'
import { ElementRef, Injectable, Renderer2 } from '@angular/core';
// import { Shape } from 'src/app/classes/shape';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { Stack } from 'src/app/classes/stack';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
// import { SVGService } from '../../svg/svg.service';
import { Tools } from 'src/app/enums/tools';
import { DrawableService } from '../drawable.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { Color } from 'src/app/classes/color';
//import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LineService extends DrawableService {

  attributes: DrawablePropertiesService;
  colorSelectorService: ColorSelectorService;
  thickness: number;
  jointIsDot: boolean;
  dotDiameter: number;
  color: string;
  opacity: string;
  private isDone: boolean;
  private isStarted: boolean;
  private points: Stack<CoordinatesXY>;
  private circles: Stack<SVGCircleElement>;
  private line: SVGPolylineElement;
  private subElement: SVGGElement;
  private shiftPressed: boolean;

  constructor() {
    super();
    this.frenchName = 'Ligne';
  }

  static getName(): Tools { return Tools.Line; }

  initialize(manipulator: Renderer2, image: ElementRef<SVGElement>): void {
    this.assignParams(manipulator, image);
    this.shiftPressed = false;
  }

  initializeProperties(attributes: DrawablePropertiesService, colorSelectorService: ColorSelectorService) {
    this.attributes = attributes;
    this.colorSelectorService = colorSelectorService;
    // this.thickness = this.attributes.thickness.value;
    // this.dotDiameter = this.attributes.dotDiameter.value;
    // this.jointIsDot = this.attributes.junction.value;

    this.colorSelectorService.primaryColor.subscribe((color: Color) => {
      this.color = color.getHex();
    });

    this.attributes.thickness.subscribe((element: number) => {
        this.thickness = element;
    });

    this.attributes.junction.subscribe((element: boolean) => {
        this.jointIsDot = element;
    });

    this.attributes.dotDiameter.subscribe((element: number) => {
        this.dotDiameter = element;
    });
/*
    this.attributes.color.subscribe((element: string) => {
      this.color = element;
    });*/
  }

  onMouseInCanvas(event: MouseEvent): void {}
  onMouseOutCanvas(event: MouseEvent): void {}

  onMouseMove(event: MouseEvent): void {
    if(this.isStarted) {
      let previewPoints = this.pointsToString();
      if (this.shiftPressed) {
        const lastPoint = this.points.getLast();
        if(lastPoint !== undefined) {
          const shiftPoint = lastPoint.getClosestPoint(Coords.effectiveX(this.image, event.clientX), Coords.effectiveY(this.image, event.clientY));
          previewPoints += shiftPoint.getX().toString() + ',' + shiftPoint.getY().toString();
        }
      } else {
      previewPoints += Coords.effectiveX(this.image, event.clientX).toString()
          + ',' + Coords.effectiveY(this.image, event.clientY).toString();
      }
      this.manipulator.setAttribute(
          this.line,
          SVGProperties.pointsList,
          previewPoints
      );
    }
  }

  onKeyPressed(event: KeyboardEvent): void {
    if (event.shiftKey) {
      this.shiftPressed = true;
    }
  }

  onKeyReleased(event: KeyboardEvent): void {
    if (!event.shiftKey) {
      this.shiftPressed = false;
    }
  }

  addPointToLine(onScreenX: number, onScreenY: number): void {
    if (this.shiftPressed) {
      const lastPoint = this.points.getLast();
      if (lastPoint !== undefined) {
        this.points.push_back(lastPoint.getClosestPoint(Coords.effectiveX(this.image, onScreenX), Coords.effectiveY(this.image, onScreenY)));
      }
    } else {
      this.points.push_back(new CoordinatesXY(onScreenX, onScreenY));
    }
    this.updateLine();
  }

  onDoubleClick(event: MouseEvent): void { // Should end line
    if (this.isStarted && !this.isDone) {
      const lastPoint = new CoordinatesXY(Coords.effectiveX(this.image, event.clientX), Coords.effectiveY(this.image, event.clientY));
      const firstPoint = this.points.getRoot();
      if(firstPoint !== undefined) {
        const differenceOfCoordinatesX = firstPoint.getX() - lastPoint.getX();
        const differenceOfCoordinatesY = firstPoint.getY() - lastPoint.getY();
        const isWithin3Px: boolean =
          differenceOfCoordinatesX <= 3 &&
          differenceOfCoordinatesX >= -3 &&
          differenceOfCoordinatesY <= 3 &&
          differenceOfCoordinatesY >= -3;
        if(isWithin3Px) {
          this.addPointToLine(firstPoint.getX(), firstPoint.getY());
        } else {
          this.addPointToLine(Coords.effectiveX(this.image, event.clientX), Coords.effectiveY(this.image, event.clientY));
        }
      }
      // Send the line to the whole image to be pushed
      this.points.clear();
      this.isStarted = false;
      this.isDone = true;
    }
  }

  onClick(event: MouseEvent): void {
    if (this.isStarted) {
      this.addPointToLine(Coords.effectiveX(this.image, event.clientX), Coords.effectiveY(this.image, event.clientY));
    } else {
      this.updateSVGProperties();
      this.points = new Stack<CoordinatesXY>();
      this.circles = new Stack<SVGCircleElement>();
      this.addPointToLine(Coords.effectiveX(this.image, event.clientX), Coords.effectiveY(this.image, event.clientY));
      this.isStarted = true;
      this.isDone = false;
    }

    if (this.jointIsDot) {
      const circle: SVGCircleElement = this.manipulator.createElement('circle', 'http://www.w3.org/2000/svg');
      this.manipulator.setAttribute(circle, SVGProperties.centerX, Coords.effectiveX(this.image, event.clientX).toString());
      this.manipulator.setAttribute(circle, SVGProperties.centerY, Coords.effectiveY(this.image, event.clientY).toString());
      this.manipulator.setAttribute(circle, SVGProperties.radius, (this.dotDiameter / 2).toString());
      this.manipulator.setAttribute(circle, SVGProperties.radius, (this.dotDiameter / 2).toString());
      this.manipulator.setAttribute(circle, SVGProperties.color, this.color);
      this.manipulator.setAttribute(circle, SVGProperties.fill, this.color);
      this.manipulator.setAttribute(circle, SVGProperties.opacity, this.opacity);
      this.manipulator.appendChild(this.subElement, circle);
      this.circles.push_back(circle);
    }
  }

  deleteLine(): void {
    this.isDone = true;
    this.isStarted = false;
    this.points.clear();
    this.circles.clear();
    this.manipulator.removeChild(this.image, this.subElement);
  }

  removeLastPoint(): void {
    this.points.pop_back();
    this.updateLine();
    if (this.jointIsDot) {
      const lastCircle = this.circles.pop_back();
      this.manipulator.removeChild(this.subElement, lastCircle);
    }
  }

  getLineIsDone(): boolean { return this.isDone; }

  private updateLine(): void {
    this.manipulator.setAttribute(
      this.line,
      SVGProperties.pointsList,
      this.pointsToString()
    );
  }

  private updateSVGProperties(): void {
    this.subElement = this.manipulator.createElement('g', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.subElement, SVGProperties.title, Tools.Line);
    this.line = this.manipulator.createElement(SVGProperties.polyLine, 'http://www.w3.org/2000/svg');

    this.manipulator.setAttribute(this.line, SVGProperties.fill, 'none');
    this.manipulator.setAttribute(this.line, SVGProperties.thickness, this.thickness.toString());
    this.manipulator.setAttribute(this.line, SVGProperties.color, this.color);
    this.manipulator.setAttribute(this.line, SVGProperties.opacity, this.opacity);

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
}
