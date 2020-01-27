import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { DrawableService } from '../drawable.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { Tools } from 'src/app/enums/tools';

@Injectable({
  providedIn: 'root'
})
export class BrushService extends DrawableService {

  path: string;
  previousX: number;
  previousY: number;
  thickness: number;
  isDrawing: boolean;
  subElement: SVGGElement;
  attributes: DrawablePropertiesService;

  constructor() {
    super();
    this.isDrawing = false;
    this.path = '';
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
    return `${Math.floor(this.thickness)}`;
  }
  onMouseInCanvas(event: MouseEvent): void {
    this.updateProperties();
    this.onMouseMove(event);
  }
  onMouseOutCanvas(event: MouseEvent): void {
    console.log('Out of canvas');
    //this.isDrawing = false;
  }
  onMousePress(event: MouseEvent): void {
    this.isDrawing = true;
    this.beginPath(event.clientX, event.clientY);
    console.log('Mouse Pressed');

  }
  onMouseRelease(event: MouseEvent): void {
    if(event.button === 0) { // 0 for the left mouse button
      //this.isDrawing = false;
    }
  }
  onMouseMove(event: MouseEvent): void {
    console.log('Moving');
    if(this.isDrawing){
    this.addPath(event.clientX, event.clientY);
    }
    else{

    }
  }
  onDoubleClick(event: MouseEvent): void {}

  onClick(event: MouseEvent): void {
    console.log('Mouse Clicked');
    this.isDrawing = false;
    this.updateProperties();
    /*if(event.button === 0) { // 0 for the left mouse button
      this.isDrawing = true;
      this.updateProperties();
      // Ajouter le premier point
    }*/
    this.endPath();
  }
  onKeyPressed(event: KeyboardEvent): void {}
  onKeyReleased(event: KeyboardEvent): void {}

  private updateProperties(): void {
    this.subElement = this.manipulator.createElement('g', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.subElement, SVGProperties.title, Tools.Pencil);
    this.manipulator.appendChild(this.image.nativeElement, this.subElement);
  }

  private beginPath(clientX: number, clientY: number) {
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
    let line: SVGPathElement;
    line = this.manipulator.createElement(SVGProperties.path,'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(line, SVGProperties.fill, 'none');
    this.manipulator.setAttribute(line, SVGProperties.color, 'red');
    this.manipulator.setAttribute(line, SVGProperties.d, this.path);
    this.manipulator.setAttribute(line, SVGProperties.thickness, this.getThickness());
    this.manipulator.appendChild(this.image.nativeElement, line);

  }
}
