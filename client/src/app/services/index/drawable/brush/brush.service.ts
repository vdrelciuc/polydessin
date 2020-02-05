import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { DrawableService } from '../drawable.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';

@Injectable({
  providedIn: 'root'
})
export class BrushService extends DrawableService {
  selectedFilter: string;
  path: string;
  previousX: number;
  previousY: number;
  thickness: number;
  isDrawing: boolean;
  previewLine: SVGPathElement;
  previewCricle: SVGCircleElement;
  attributes: DrawablePropertiesService;

  constructor() {
    super();
    this.isDrawing = false;
    this.path = '';
    this.selectedFilter = 'filter0';
   }

  initialize(manipulator: Renderer2, image: ElementRef<SVGElement>): void {
    this.assignParams(manipulator, image);
  }
  initializeProperties(attributes: DrawablePropertiesService): void {
    this.attributes = attributes;
    this.thickness = this.attributes.thickness.value;

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
      this.previewCricle = this.createCircle(this.effectiveX(event.clientX), this.effectiveY(event.clientY));
    }
    this.manipulator.setAttribute(this.previewCricle, SVGProperties.radius, (this.getThickness() / 2).toString());
    this.manipulator.appendChild(this.image.nativeElement, this.previewCricle);
  }
  onMouseOutCanvas(event: MouseEvent): void {
    console.log('Out of canvas');
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
    console.log('Mouse Pressed');
    this.previewLine = this.manipulator.createElement(SVGProperties.path, 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.previewLine, SVGProperties.fill, 'none');
    this.manipulator.setAttribute(this.previewLine, SVGProperties.color, 'red');
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
      console.log('mouse release');
      if (this.isDrawing) {
        this.isDrawing = false;
        this.addPath(event.clientX, event.clientY);
        this.endPath();
      }
    }
  }
  onMouseMove(event: MouseEvent): void {
    console.log('Moving');
    if (this.isDrawing) {
    this.addPath(event.clientX, event.clientY);

    this.manipulator.setAttribute(this.previewLine, SVGProperties.d, this.path);
    } else {this.updateCursor(event.clientX, event.clientY); }
  }

  onClick(event: MouseEvent): void {
    console.log('Mouse Clicked');
    this.isDrawing = false;
  }

  onDoubleClick(event: MouseEvent): void {
    throw new Error('Method not implemented.');
  }

  onKeyPressed(event: KeyboardEvent): void {
    throw new Error('Method not implemented.');
  }
  onKeyReleased(event: KeyboardEvent): void {
    throw new Error('Method not implemented.');
  }

  private beginDraw(clientX: number, clientY: number) {
    this.previousX = clientX;
    this.previousY = clientY;
    this.path = `M ${this.effectiveX(clientX)},${this.effectiveY(clientY)}`;
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
      const circle = this.createCircle(this.effectiveX(this.previousX), this.effectiveY(this.previousY));
      this.manipulator.appendChild(this.image.nativeElement, circle);
    }
    // this.manipulator.setAttribute(this.previewLine, SVGProperties.d, this.path);

    this.manipulator.appendChild(this.image.nativeElement, this.previewCricle);
  }

  updateCursor(clientX: number, clientY: number) {
    this.manipulator.setAttribute(this.previewCricle, SVGProperties.centerX, this.effectiveX(clientX).toString());
    this.manipulator.setAttribute(this.previewCricle, SVGProperties.centerY, this.effectiveY(clientY).toString());
  }
  private createCircle(x: number, y: number): SVGCircleElement {
    let circle: SVGCircleElement;
    circle = this.manipulator.createElement(SVGProperties.circle, 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(circle, SVGProperties.fill, 'red');
    this.manipulator.setAttribute(circle, SVGProperties.radius, (this.getThickness() / 2).toString());
    this.manipulator.setAttribute(circle, SVGProperties.centerX, x.toString());
    this.manipulator.setAttribute(circle, SVGProperties.centerY, y.toString());
    this.manipulator.setAttribute(circle, 'filter', `url(#${this.selectedFilter})`);
    return circle;
  }

}
