import { Coords } from 'src/app/classes/coordinates';
import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { DrawableService } from '../drawable.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { Color } from 'src/app/classes/color';

@Injectable({
  providedIn: 'root'
})
export class PencilService extends DrawableService {

  private path: string;
  private previousX: number;
  private previousY: number;
  thickness: number;
  isDrawing: boolean;
  private line: SVGPathElement;
  private mousePointer: SVGCircleElement;
  private color: Color;
  attributes: DrawablePropertiesService;
  colorSelectorService: ColorSelectorService;

  constructor() {
    super();
    this.frenchName = 'Crayon';
    this.isDrawing = false;
    this.path = '';
   }

  initialize(manipulator: Renderer2, image: ElementRef<SVGElement>,
    colorSelectorService: ColorSelectorService): void {
    this.assignParams(manipulator, image, colorSelectorService);
    this.initializeProperties();
  }

  initializeProperties(): void {
    this.colorSelectorService.primaryColor.subscribe((color: Color) => {
      this.color = color;
    });

    this.thickness = this.attributes.thickness.value;
    this.attributes.thickness.subscribe((element: number) => {
      this.thickness = element;
    });
  }

  onMouseInCanvas(event: MouseEvent): void {
    if (this.mousePointer === undefined) {
      this.createCircle(Coords.effectiveX(this.image, event.clientX), Coords.effectiveY(this.image, event.clientY));
    }
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.radius, (this.thickness / 2).toString());
    this.manipulator.appendChild(this.image.nativeElement, this.mousePointer);
  }
  onMouseOutCanvas(event: MouseEvent): void {
    this.manipulator.removeChild(this.image.nativeElement, this.mousePointer);
    this.isDrawing = false;
    delete(this.mousePointer);
  }

  onMousePress(event: MouseEvent): void {
    this.isDrawing = true;
    this.beginDraw(event.clientX, event.clientY);
    this.line = this.manipulator.createElement('path', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.line, SVGProperties.fill, 'none');
    this.manipulator.setAttribute(this.line, SVGProperties.color, this.color.getHex());
    this.manipulator.setAttribute(this.line, SVGProperties.typeOfLine, 'round');
    this.manipulator.setAttribute(this.line, SVGProperties.endOfLine, 'round');
    //this.manipulator.setAttribute(this.line, 'stroke-linecap', 'round');
    // this.manipulator.setAttribute(this.line, SVGProperties.endOfLine, 'round');
    this.manipulator.setAttribute(this.line, 'd', this.path);
    this.manipulator.setAttribute(this.line, SVGProperties.thickness, this.thickness.toString());
    this.manipulator.appendChild(this.image.nativeElement, this.line);
    this.manipulator.removeChild(this.image.nativeElement, this.mousePointer);
    this.addPath(event.clientX, event.clientY);
  }

  onMouseRelease(event: MouseEvent): void {
    if (event.button === 0) { // 0 for the left mouse button
      this.isDrawing = false;
      this.endPath();
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isDrawing) {
      this.addPath(event.clientX, event.clientY);
    } else {
      this.updateCursor(event.clientX, event.clientY);
    }
  }

  private beginDraw(clientX: number, clientY: number) {
    this.previousX = clientX;
    this.previousY = clientY;
    this.path = `M ${Coords.effectiveX(this.image, clientX)},${Coords.effectiveY(this.image, clientY)}`;
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
      const circle = this.createCircle(Coords.effectiveX(this.image, this.previousX), Coords.effectiveY(this.image, this.previousY));
      this.manipulator.appendChild(this.image.nativeElement, circle);
    }
    this.manipulator.setAttribute(this.line, 'd', this.path);

    this.manipulator.appendChild(this.image.nativeElement, this.mousePointer);
  }

  private updateCursor(clientX: number, clientY: number) {
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.centerX, Coords.effectiveX(this.image, clientX).toString());
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.centerY, Coords.effectiveY(this.image, clientY).toString());
  }

  private createCircle(x: number, y: number): void {
    this.mousePointer = this.manipulator.createElement(SVGProperties.circle, 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.fill, this.color.getHex());
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.radius, (this.thickness / 2).toString());
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.centerX, x.toString());
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.centerY, y.toString());
  }
}
