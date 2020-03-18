import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { Color } from 'src/app/classes/color';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import { DrawableService } from '../drawable.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';

@Injectable({
  providedIn: 'root'
})
export class PencilService extends DrawableService {

  private path: string;
  private previousX: number;
  private previousY: number;
  thickness: number;
  isDrawing: boolean;
  protected line: SVGPathElement;
  protected mousePointer: SVGCircleElement;
  private color: Color;
  opacity: number;
  attributes: DrawablePropertiesService;
  colorSelectorService: ColorSelectorService;

  constructor() {
    super();
    this.frenchName = 'Crayon';
    this.isDrawing = false;
    this.path = '';
  }

  initialize(manipulator: Renderer2, image: ElementRef<SVGElement>,
             colorSelectorService: ColorSelectorService,
             drawStack: DrawStackService): void {
      this.assignParams(manipulator, image, colorSelectorService, drawStack);
      this.initializeProperties();
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
    this.createCircle(CoordinatesXY.effectiveX(this.image, event.clientX), CoordinatesXY.effectiveY(this.image, event.clientY));
  }

  onMouseOutCanvas(event: MouseEvent): void {
    if (this.isDrawing) {
      this.addPath(event.clientX, event.clientY);
      this.isDrawing = false;
      this.pushElement();
    }
    if (this.mousePointer !== undefined) {
      this.manipulator.removeChild(this.image.nativeElement, this.mousePointer);
      delete(this.mousePointer);
    }
  }

  onMousePress(event: MouseEvent): void {
    if (this.mousePointer !== undefined) {
      this.manipulator.removeChild(this.image.nativeElement, this.mousePointer);
      delete(this.mousePointer);
    }
    this.isDrawing = true;
    this.beginDraw(event.clientX, event.clientY);
    this.subElement = this.manipulator.createElement('g', 'http://www.w3.org/2000/svg');
    this.line = this.manipulator.createElement('path', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.subElement, SVGProperties.title, 'pencil-path');
    this.manipulator.setAttribute(this.line, SVGProperties.fill, 'none');
    this.manipulator.setAttribute(this.line, SVGProperties.color, this.color.getHex());
    this.manipulator.setAttribute(this.line, SVGProperties.globalOpacity, this.opacity.toString());
    this.manipulator.setAttribute(this.line, SVGProperties.typeOfLine, 'round');
    this.manipulator.setAttribute(this.line, SVGProperties.endOfLine, 'round');
    this.manipulator.setAttribute(this.line, 'd', this.path);
    this.manipulator.setAttribute(this.line, SVGProperties.thickness, this.thickness.toString());

    this.manipulator.appendChild(this.subElement, this.line);
    this.manipulator.appendChild(this.image.nativeElement, this.subElement);

    this.addPath(event.clientX, event.clientY);
  }

  onMouseRelease(event: MouseEvent): void {
    if (this.isDrawing) {
      this.addPath(event.clientX, event.clientY);
      this.isDrawing = false;
      this.pushElement();
      this.updateCursor(event.clientX, event.clientY);
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isDrawing) {
      this.addPath(event.clientX, event.clientY);
    } else {
      this.updateCursor(event.clientX, event.clientY);
    }
  }

  endTool(): void {
    if (this.isDrawing) {
      this.subElement.remove();
      delete(this.subElement);
    }
    if (this.mousePointer !== undefined) {
      this.mousePointer.remove();
      delete(this.mousePointer);
    }

    this.isDrawing = false;
    this.path = '';
  }

  private beginDraw(clientX: number, clientY: number): void {
    this.previousX = clientX;
    this.previousY = clientY;
    this.path = `M ${CoordinatesXY.effectiveX(this.image, clientX)},${CoordinatesXY.effectiveY(this.image, clientY)}`;
  }

  private addPath(clientX: number, clientY: number): void {
    const pathToAdd = ` l ${clientX - this.previousX},${clientY - this.previousY}`;
    this.previousX = clientX;
    this.previousY = clientY;
    this.path = this.path + (pathToAdd);
    this.manipulator.setAttribute(this.line, 'd', this.path);
  }

  private updateCursor(clientX: number, clientY: number): void {
    if (this.mousePointer === undefined) {
      this.createCircle(CoordinatesXY.effectiveX(this.image, clientX), CoordinatesXY.effectiveY(this.image, clientY));
    } else {
      this.manipulator.setAttribute(this.mousePointer, SVGProperties.centerX, CoordinatesXY.effectiveX(this.image, clientX).toString());
      this.manipulator.setAttribute(this.mousePointer, SVGProperties.centerY, CoordinatesXY.effectiveY(this.image, clientY).toString());
    }
  }

  protected createCircle(x: number, y: number): void {
    this.mousePointer = this.manipulator.createElement(SVGProperties.circle, 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.fill, this.color.getHex());
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.globalOpacity, this.opacity.toString());
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.radius, (this.thickness / 2).toString());
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.centerX, x.toString());
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.centerY, y.toString());
    this.manipulator.appendChild(this.image.nativeElement, this.mousePointer);
  }
}
