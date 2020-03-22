import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { Color } from 'src/app/classes/color';
import { OFFSET_MIN, SIZEOF_POINT } from 'src/app/classes/constants';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { Stack } from 'src/app/classes/stack';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { Tools } from 'src/app/enums/tools';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
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
  color: Color;
  opacity: number;
  private isDone: boolean;
  private isStarted: boolean;
  private points: Stack<CoordinatesXY>;
  private circles: Stack<SVGCircleElement>;
  private line: SVGPolylineElement;
  private shiftPressed: boolean;
  private pointerPosition: CoordinatesXY;

  constructor() {
    super();
    this.frenchName = 'Ligne';
    this.points = new Stack<CoordinatesXY>();
    this.circles = new Stack<SVGCircleElement>();

  }

  static getName(): Tools { return Tools.Line; }

  initialize(
    manipulator: Renderer2,
    image: ElementRef<SVGElement>,
    colorSelectorService: ColorSelectorService,
    drawStack: DrawStackService): void {
    this.assignParams(manipulator, image, colorSelectorService, drawStack);
    this.initializeProperties();
    this.shiftPressed = false;
    this.isStarted = false;
    this.isDone = true;
  }

  initializeProperties(): void {
    this.thickness = this.attributes.thickness.value;
    this.dotDiameter = this.attributes.dotDiameter.value;
    this.jointIsDot = this.attributes.junction.value;

    this.colorSelectorService.primaryColor.subscribe((color: Color) => {
      this.color = color;
    });

    this.colorSelectorService.primaryTransparency.subscribe((opacity: number) => {
      this.opacity = opacity;
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
  }

  onMouseMove(event: MouseEvent): void {
    // Save pointer position to allow line update on shift press/release without moving
    this.pointerPosition = new CoordinatesXY(event.clientX, event.clientY);

    if (this.isStarted) {
      this.followPointer();
    }
  }

  onKeyPressed(event: KeyboardEvent): void {
    if (event.shiftKey && !this.shiftPressed) {
      this.shiftPressed = true;
      if (!this.isDone) {
        this.followPointer();
      }
    }
  }

  onKeyReleased(event: KeyboardEvent): void {
    if (!event.shiftKey && this.shiftPressed) {
      this.shiftPressed = false;
      if (!this.isDone) {
        this.followPointer();
      }
    }
  }

  private followPointer(): void {
    let previewPoints = this.pointsToString();
    if (this.shiftPressed) {
      const lastPoint = this.points.getLast();
      if (lastPoint !== undefined) {
        const canvasHeight = this.image.nativeElement.clientHeight;
        const effectiveX = CoordinatesXY.effectiveX(this.image, this.pointerPosition.getX());
        const effectiveY = CoordinatesXY.effectiveY(this.image, this.pointerPosition.getY());
        const shiftPoint = lastPoint.getClosestPoint(effectiveX, effectiveY, canvasHeight);
        previewPoints += shiftPoint.getX() + ',' + shiftPoint.getY();
      }
    } else {
    previewPoints += CoordinatesXY.effectiveX(this.image, this.pointerPosition.getX()).toString()
        + ',' + CoordinatesXY.effectiveY(this.image, this.pointerPosition.getY()).toString();
    }
    this.manipulator.setAttribute(
        this.line,
        SVGProperties.points,
        previewPoints
    );
  }

  addPointToLine(onScreenX: number, onScreenY: number): void {
    if (this.shiftPressed) {
      const lastPoint = this.points.getLast();
      if (lastPoint !== undefined) {
        const canvasHeight = this.image.nativeElement.clientHeight;
        this.points.push_back(lastPoint.getClosestPoint(onScreenX, onScreenY, canvasHeight));
      }
    } else {
      this.points.push_back(new CoordinatesXY(onScreenX, onScreenY));
    }
    this.updateLine();
  }

  onDoubleClick(event: MouseEvent): void { // Should end line
    if (this.isStarted && !this.isDone) {
      const effectiveX = CoordinatesXY.effectiveX(this.image, event.clientX);
      const effectiveY = CoordinatesXY.effectiveY(this.image, event.clientY);
      const firstPoint = this.points.getRoot();
      // Remove last point and cancel double point from appearing
      this.removeLastPoint();

      if (firstPoint !== undefined) {
        const differenceOfCoordinatesX = Math.abs(firstPoint.getX() - effectiveX);
        const differenceOfCoordinatesY = Math.abs(firstPoint.getY() - effectiveY);
        const isWithin3Px: boolean = differenceOfCoordinatesX <= OFFSET_MIN && differenceOfCoordinatesY <= OFFSET_MIN;
        if (isWithin3Px) {
          this.removeLastPoint();
          this.points.push_back(firstPoint);
        } else {
          this.addPointToLine(CoordinatesXY.effectiveX(this.image, event.clientX), CoordinatesXY.effectiveY(this.image, event.clientY));
        }
      }
      this.updateLine();
      // Send the line to the whole image to be pushed
      this.points.clear();
      this.isStarted = false;
      this.isDone = true;
      this.pushElement();
    }
  }

  onClick(event: MouseEvent): void {
    let recoverShiftPressed = false;
    if (!this.isStarted) {
      if (this.shiftPressed) {
        // This case happens if shift is pressed before first click
        // shiftPressed will be recovered at the end of onClick function
        recoverShiftPressed = true;
        this.shiftPressed = false;
      }
      this.points = new Stack<CoordinatesXY>();
      this.circles = new Stack<SVGCircleElement>();
      this.updateProperties();
      this.isStarted = true;
      this.isDone = false;
    }
    if (this.jointIsDot) {
      const effectiveX = CoordinatesXY.effectiveX(this.image, event.clientX);
      const effectiveY = CoordinatesXY.effectiveY(this.image, event.clientY);
      let pointToDisplay = new CoordinatesXY(effectiveX, effectiveY);
      if (this.shiftPressed) {
        const lastPoint = this.points.getLast();
        if (lastPoint !== undefined) {
          const canvasHeight = this.image.nativeElement.clientHeight;
          pointToDisplay = lastPoint.getClosestPoint(effectiveX, effectiveY, canvasHeight);
        }
      }
      const circle: SVGCircleElement = this.manipulator.createElement('circle', 'http://www.w3.org/2000/svg');
      this.manipulator.setAttribute(circle, SVGProperties.centerX, pointToDisplay.getX().toString());
      this.manipulator.setAttribute(circle, SVGProperties.centerY, pointToDisplay.getY().toString());
      this.manipulator.setAttribute(circle, SVGProperties.radius, (this.dotDiameter / 2).toString());
      this.manipulator.setAttribute(circle, SVGProperties.color, this.color.getHex());
      this.manipulator.setAttribute(circle, SVGProperties.fill, this.color.getHex());
      this.manipulator.setAttribute(circle, SVGProperties.globalOpacity, this.opacity.toString());
      this.manipulator.appendChild(this.subElement, circle);
      this.circles.push_back(circle);
    }
    this.addPointToLine(CoordinatesXY.effectiveX(this.image, event.clientX), CoordinatesXY.effectiveY(this.image, event.clientY));
    this.followPointer();

    if (recoverShiftPressed) {
      this.shiftPressed = true;
    }
  }

  endTool(): void {
    if (this.isStarted && !this.isDone) {
      this.subElement.remove();
    }
    this.shiftPressed = false;
    this.isStarted = false;
    this.isDone = true;
  }

  deleteLine(): void {
    this.isDone = true;
    this.isStarted = false;
    this.points.clear();
    this.circles.clear();
    this.manipulator.removeChild(this.image, this.subElement);
  }

  removeLastPoint(): void {
    const point = this.points.pop_back();
    if (point !== undefined) {
      this.updateLine();
      if (this.jointIsDot) {
        const lastCircle = this.circles.pop_back();
        this.manipulator.removeChild(this.subElement, lastCircle);
      }
      this.followPointer();
    }

    let previewPoints = this.pointsToString();
    // Removing last 8 characters, which correspond to a point in SVG attribute
    previewPoints = previewPoints.slice(0, - SIZEOF_POINT);
    this.manipulator.setAttribute(this.line, SVGProperties.points, previewPoints);
  }

  getLineIsDone(): boolean { return this.isDone; }

  private updateLine(): void {
    this.manipulator.setAttribute(
      this.line,
      SVGProperties.points,
      this.pointsToString()
    );
  }

  private updateProperties(): void {
    this.subElement = this.manipulator.createElement('g', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.subElement, SVGProperties.title, Tools.Line);
    this.line = this.manipulator.createElement(SVGProperties.polyLine, 'http://www.w3.org/2000/svg');

    this.manipulator.setAttribute(this.line, SVGProperties.fill, 'none');
    this.manipulator.setAttribute(this.line, SVGProperties.thickness, this.thickness.toString());
    this.manipulator.setAttribute(this.line, SVGProperties.color, this.color.getHex());
    this.manipulator.setAttribute(this.line, SVGProperties.globalOpacity, this.opacity.toString());
    this.manipulator.setAttribute(this.line, SVGProperties.typeOfLine, 'round');
    this.manipulator.setAttribute(this.line, SVGProperties.endOfLine, 'round');

    this.manipulator.appendChild(this.subElement, this.line);
    this.manipulator.appendChild(this.image.nativeElement, this.subElement);
  }

  private pointsToString({newPoints= this.points}: {newPoints?: Stack<CoordinatesXY>}= {}): string {
    let pointsToString = '';
    for (const point of newPoints.getAll()) {
      pointsToString += point.getX() + ',' + point.getY() + ' ';
    }
    return pointsToString;
  }
}
