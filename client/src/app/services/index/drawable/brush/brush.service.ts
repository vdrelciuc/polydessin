import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { DrawableService } from '../drawable.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { FilterList } from 'src/app/classes/patterns';
import { Coords } from 'src/app/classes/coordinates';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { Color } from 'src/app/classes/color';

@Injectable({
  providedIn: 'root'
})
export class BrushService extends DrawableService {
  selectedFilter: string;
  path: string;
  private color: Color;
  previousX: number;
  previousY: number;
  thickness: number;
  isDrawing: boolean;
  previewLine: SVGPathElement;
  previewCricle: SVGCircleElement;
  attributes: DrawablePropertiesService;
  colorSelectorService: ColorSelectorService;

  constructor() {
    super();
    this.isDrawing = false;
    this.path = '';
    this.selectedFilter = FilterList[0].referenceID;
   }

  initialize(manipulator: Renderer2, image: ElementRef<SVGElement>,
      colorSelectorService: ColorSelectorService): void {
    this.assignParams(manipulator, image, colorSelectorService);
    this.initializeProperties();
  }
  
  initializeProperties(): void {
    this.thickness = this.attributes.thickness.value;

    this.colorSelectorService.primaryColor.subscribe((color: Color) => {
      this.color = color;
    });

    this.attributes.thickness.subscribe((element: number) => {
      this.thickness = element;
    });

    // Create a type for the 5 different textures
    // Subscribe to that type (for changes and updates)
  }

  getThickness() {
    return Math.floor(this.thickness);
  }
  onMouseInCanvas(event: MouseEvent): void {
    if (this.previewCricle === undefined) {
      this.previewCricle = this.createCircle(Coords.effectiveX(this.image, event.clientX), Coords.effectiveY(this.image, event.clientY));
    }
    this.manipulator.setAttribute(this.previewCricle, SVGProperties.radius, (this.getThickness() / 2).toString());
    this.manipulator.appendChild(this.image.nativeElement, this.previewCricle);
  }
  onMouseOutCanvas(event: MouseEvent): void {
    if (this.isDrawing) {
      this.addPath(event.clientX, event.clientY);
      this.endPath();
      this.isDrawing = false;
    }
    this.manipulator.removeChild(this.image.nativeElement, this.previewCricle);
    delete(this.previewCricle);
  }
  onMousePress(event: MouseEvent): void {
    this.isDrawing = true;
    this.beginDraw(event.clientX, event.clientY);
    this.previewLine = this.manipulator.createElement(SVGProperties.path, 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.previewLine, SVGProperties.fill, 'none');
    this.manipulator.setAttribute(this.previewLine, SVGProperties.color, this.color.getHex());
    this.manipulator.setAttribute(this.previewLine, SVGProperties.typeOfLine, 'round');
    this.manipulator.setAttribute(this.previewLine, SVGProperties.endOfLine, 'round');
    this.manipulator.setAttribute(this.previewLine, SVGProperties.d, this.path);
    this.manipulator.setAttribute(this.previewLine, SVGProperties.thickness, `${this.getThickness()}`);
    this.manipulator.setAttribute(this.previewLine, 'filter', `url(#${this.selectedFilter})`);

    this.manipulator.appendChild(this.image.nativeElement, this.previewLine);

    this.manipulator.removeChild(this.image.nativeElement, this.previewCricle);
  }
  onMouseRelease(event: MouseEvent): void {
    if (event.button === 0) { // 0 for the left mouse button
      if (this.isDrawing) {
        this.isDrawing = false;
        //this.addPath(event.clientX, event.clientY);
        this.endPath();
      }
    }
  }
  onMouseMove(event: MouseEvent): void {
    if (this.isDrawing) {
    this.addPath(event.clientX, event.clientY);

    this.manipulator.setAttribute(this.previewLine, SVGProperties.d, this.path);
    } else {this.updateCursor(event.clientX, event.clientY); }
  }

  onClick(event: MouseEvent): void {
    this.isDrawing = false;
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
  }
  private endPath() {
    if (this.path.indexOf('l') === -1) {
      this.manipulator.removeChild(this.image.nativeElement, this.previewLine);
      const circle = this.createCircle(Coords.effectiveX(this.image, this.previousX), Coords.effectiveY(this.image, this.previousY));
      this.manipulator.appendChild(this.image.nativeElement, circle);
    }
    // this.manipulator.setAttribute(this.previewLine, SVGProperties.d, this.path);

    this.manipulator.appendChild(this.image.nativeElement, this.previewCricle);
  }

  updateCursor(clientX: number, clientY: number) {
    this.manipulator.setAttribute(this.previewCricle, SVGProperties.centerX, Coords.effectiveX(this.image, clientX).toString());
    this.manipulator.setAttribute(this.previewCricle, SVGProperties.centerY, Coords.effectiveY(this.image, clientY).toString());
  }
  private createCircle(x: number, y: number): SVGCircleElement {
    let circle: SVGCircleElement;
    circle = this.manipulator.createElement(SVGProperties.circle, 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(circle, SVGProperties.fill, this.color.getHex());
    this.manipulator.setAttribute(circle, SVGProperties.radius, (this.getThickness() / 2).toString());
    this.manipulator.setAttribute(circle, SVGProperties.centerX, x.toString());
    this.manipulator.setAttribute(circle, SVGProperties.centerY, y.toString());
    this.manipulator.setAttribute(circle, 'filter', `url(#${this.selectedFilter})`);
    return circle;
  }

}
