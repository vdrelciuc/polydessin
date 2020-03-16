import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { Color } from 'src/app/classes/color';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { FilterList } from 'src/app/components/brush/patterns';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawableService } from '../drawable.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';

@Injectable({
  providedIn: 'root'
})
export class BrushService extends DrawableService {
  selectedFilter: string;
  path: string;
  private color: Color;
  opacity: number;
  previousX: number;
  previousY: number;
  thickness: number;
  isDrawing: boolean;
  previewLine: SVGPathElement;
  mousePointer: SVGCircleElement;
  attributes: DrawablePropertiesService;
  colorSelectorService: ColorSelectorService;

  constructor() {
    super();
    this.frenchName = 'Pinceau';
    this.isDrawing = false;
    this.path = '';
    this.selectedFilter = FilterList[0].referenceID;
  }

  initialize(
    manipulator: Renderer2,
    image: ElementRef<SVGElement>,
    colorSelectorService: ColorSelectorService,
    drawStack: DrawStackService): void {
      this.assignParams(manipulator, image, colorSelectorService, drawStack);
      this.initializeProperties();
    }

    initializeProperties(): void {
      this.thickness = this.attributes.thickness.value;

      this.colorSelectorService.primaryColor.subscribe((color: Color) => {
        this.color = color;
      });

      this.colorSelectorService.primaryTransparency.subscribe((opacity: number) => {
        this.opacity = opacity;
      });

      this.attributes.thickness.subscribe((element: number) => {
        this.thickness = element;
      });
    }

  onMouseInCanvas(event: MouseEvent): void {
    this.createCircle(CoordinatesXY.effectiveX(this.image, event.clientX), CoordinatesXY.effectiveY(this.image, event.clientY));
  }

  onMouseOutCanvas(event: MouseEvent): void {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.endPath();
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
    this.manipulator.setAttribute(this.subElement, SVGProperties.title, 'brush-path');
    this.previewLine = this.manipulator.createElement(SVGProperties.path, 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.previewLine, SVGProperties.fill, 'none');
    this.manipulator.setAttribute(this.previewLine, SVGProperties.color, this.color.getHex());
    this.manipulator.setAttribute(this.previewLine, SVGProperties.globalOpacity, this.opacity.toString());
    this.manipulator.setAttribute(this.previewLine, SVGProperties.typeOfLine, 'round');
    this.manipulator.setAttribute(this.previewLine, SVGProperties.endOfLine, 'round');
    this.manipulator.setAttribute(this.previewLine, SVGProperties.d, this.path);
    this.manipulator.setAttribute(this.previewLine, SVGProperties.thickness, `${this.thickness.toString()}`);
    this.manipulator.setAttribute(this.previewLine, 'filter', `url(#${this.selectedFilter})`);

    this.manipulator.appendChild(this.subElement, this.previewLine);
    this.manipulator.appendChild(this.image.nativeElement, this.subElement);
    this.addPath(event.clientX, event.clientY);
  }
  onMouseRelease(event: MouseEvent): void {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.endPath();
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
      this.manipulator.removeChild(this.image.nativeElement, this.subElement);
    }
    if (this.mousePointer !== undefined) {
      this.manipulator.removeChild(this.image.nativeElement, this.mousePointer);
      delete(this.mousePointer);
    }
    this.isDrawing = false;
    this.path = '';
  }

  private beginDraw(clientX: number, clientY: number): void {
    this.previousX = clientX;
    this.previousY = clientY;
    this.path = `M ${CoordinatesXY.effectiveX(this.image, clientX)},${CoordinatesXY.effectiveY(this.image, clientY)} l 1,1`;
  }

  private addPath(clientX: number, clientY: number) {
    const pathToAdd = ` l ${clientX - this.previousX},${clientY - this.previousY}`;
    this.previousX = clientX;
    this.previousY = clientY;
    this.path = this.path + (pathToAdd);
    this.manipulator.setAttribute(this.previewLine, SVGProperties.d, this.path);
  }
  private endPath() {
    this.manipulator.setAttribute(this.previewLine, SVGProperties.d, this.path);
  }

  updateCursor(clientX: number, clientY: number) {
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
    this.manipulator.setAttribute(this.mousePointer, 'filter', `url(#${this.selectedFilter})`);
    this.manipulator.appendChild(this.image.nativeElement, this.mousePointer);
  }
}
