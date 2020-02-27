import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { Color } from 'src/app/classes/color';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawableService } from '../drawable.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import { BehaviorSubject } from 'rxjs';
import * as CONSTANTS from 'src/app/classes/constants';

@Injectable({
  providedIn: 'root'
})
export class PencilService extends DrawableService {

  private path: string;
  private previousX: number;
  private previousY: number;
  thickness: number;
  isDrawing: BehaviorSubject<boolean>;
  private line: SVGPathElement;
  private mousePointer: SVGCircleElement;
  private color: Color;
  opacity: number;
  attributes: DrawablePropertiesService;
  colorSelectorService: ColorSelectorService;

  constructor() {
    super();
    this.frenchName = 'Crayon';
    this.isDrawing = new BehaviorSubject<boolean>(false);
    this.path = '';
   }

  initialize(manipulator: Renderer2, image: ElementRef<SVGElement>,
             colorSelectorService: ColorSelectorService,
             drawStack: DrawStackService): void {
    this.assignParams(manipulator, image, colorSelectorService, drawStack);
    this.initializeProperties();
    this.isDrawing.subscribe(
      () => {
        if(!this.isDrawing.value && this.subElement !== undefined) {
          this.pushElement();
        }
      }
    )
  }

  initializeProperties(): void {
    this.colorSelectorService.primaryColor.subscribe((color: Color) => {
      this.color = color;
    });

    this.colorSelectorService.primaryTransparency.subscribe((opacity: number) => {
      this.opacity = opacity;
    });

    this.thickness = this.attributes.thickness.value;
    this.attributes.thickness.subscribe((element: number) => {
      this.thickness = element;
    });
  }

  onMouseInCanvas(event: MouseEvent): void {
    if (this.mousePointer === undefined) {
      this.createCircle(CoordinatesXY.effectiveX(this.image, event.clientX), CoordinatesXY.effectiveY(this.image, event.clientY));
    }
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.radius, (this.thickness / 2).toString());
    this.manipulator.appendChild(this.image.nativeElement, this.mousePointer);
  }

  onMouseOutCanvas(event: MouseEvent): void {
    this.manipulator.removeChild(this.image.nativeElement, this.mousePointer);
    this.isDrawing.next(false);
  }

  onMousePress(event: MouseEvent): void {
    this.isDrawing.next(true);
    this.beginDraw(event.clientX, event.clientY);
    this.subElement = this.manipulator.createElement('g', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.subElement, SVGProperties.title, 'pencil-path');
    this.line = this.manipulator.createElement('path', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.line, SVGProperties.fill, 'none');
    this.manipulator.setAttribute(this.line, SVGProperties.color, this.color.getHex());
    this.manipulator.setAttribute(this.line, SVGProperties.globalOpacity, this.opacity.toString());
    this.manipulator.setAttribute(this.line, SVGProperties.typeOfLine, 'round');
    this.manipulator.setAttribute(this.line, SVGProperties.endOfLine, 'round');
    this.manipulator.setAttribute(this.line, 'd', this.path);
    this.manipulator.setAttribute(this.line, SVGProperties.thickness, this.thickness.toString());

    this.manipulator.appendChild(this.subElement, this.line);
    this.manipulator.appendChild(this.image.nativeElement, this.subElement);

    this.manipulator.removeChild(this.image.nativeElement, this.mousePointer);
    this.addPath(event.clientX, event.clientY);
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.visibility, 'hidden');
  }

  onMouseRelease(event: MouseEvent): void {
    if (event.button === CONSTANTS.MOUSE_LEFT) { // 0 for the left mouse button
      if (this.isDrawing.value) {
        this.isDrawing.next(false);
        this.endPath();
        this.updateCursor(event.clientX, event.clientY);
        this.manipulator.setAttribute(this.mousePointer, SVGProperties.visibility, 'visible');
      }
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isDrawing.value) {
      this.addPath(event.clientX, event.clientY);
    } else {
      this.updateCursor(event.clientX, event.clientY);
    }
  }

  endTool(): void {
    if(this.isDrawing.value) {
      this.manipulator.removeChild(this.image.nativeElement, this.subElement);
    }
    if(this.mousePointer !== undefined) {
      this.manipulator.removeChild(this.image.nativeElement, this.mousePointer);
    }
    this.isDrawing.next(false);
    this.path = '';
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.visibility, 'visible');
  }

  private beginDraw(clientX: number, clientY: number) {
    this.previousX = clientX;
    this.previousY = clientY;
    this.path = `M ${CoordinatesXY.effectiveX(this.image, clientX)},${CoordinatesXY.effectiveY(this.image, clientY)}`;
  }

  private addPath(clientX: number, clientY: number) {
    const pathToAdd = ` l ${clientX - this.previousX},${clientY - this.previousY}`;
    this.previousX = clientX;
    this.previousY = clientY;
    this.path = this.path + (pathToAdd);
    this.manipulator.setAttribute(this.line, 'd', this.path);
  }

  private endPath() {
    if (this.path.indexOf('l') === -1) {
      this.manipulator.removeChild(this.image.nativeElement, this.line);
      const effectiveX = CoordinatesXY.effectiveX(this.image, this.previousX);
      const effectiveY = CoordinatesXY.effectiveY(this.image, this.previousY);
      const circle = this.createCircle(effectiveX, effectiveY);
      this.manipulator.appendChild(this.image.nativeElement, circle);
    }
    this.manipulator.setAttribute(this.line, 'd', this.path);

    this.manipulator.appendChild(this.image.nativeElement, this.mousePointer);
  }

  private updateCursor(clientX: number, clientY: number) {
    if (this.mousePointer === undefined) {
      this.createCircle(clientX, clientY);
    }
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.centerX, CoordinatesXY.effectiveX(this.image, clientX).toString());
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.centerY, CoordinatesXY.effectiveY(this.image, clientY).toString());
  }

  private createCircle(x: number, y: number): void {
    this.mousePointer = this.manipulator.createElement(SVGProperties.circle, 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.fill, this.color.getHex());
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.globalOpacity, this.opacity.toString());
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.radius, (this.thickness / 2).toString());
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.centerX, x.toString());
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.centerY, y.toString());
  }
}
