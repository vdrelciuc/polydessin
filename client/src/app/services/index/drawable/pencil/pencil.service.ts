import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { DrawableService } from '../drawable.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { Stack } from 'src/app/classes/stack';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { Tools } from 'src/app/enums/tools';

@Injectable({
  providedIn: 'root'
})
export class PencilService extends DrawableService {

  attributes: DrawablePropertiesService;
  thickness: number;
  color: string;
  opacity: string;
  isDrawing: boolean;
  private subElement: SVGGElement;
  private circles: Stack<SVGCircleElement>;
  private mousePointer: SVGCircleElement;

  constructor() {
    super();
    this.isDrawing = false;
    this.circles = new Stack<SVGCircleElement>();
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
  }

  onMouseInCanvas(event: MouseEvent): void {
    this.updateProperties();
    this.onMouseMove(event);  
  }

  onMouseOutCanvas(event: MouseEvent): void {
    this.isDrawing = false;
    if(this.mousePointer !== undefined) {
      this.manipulator.removeChild(this.subElement, this.mousePointer);
    }
  }

  onMousePress(event: MouseEvent): void {
    if(event.button === 0) { // 0 for the left mouse button
      this.updateProperties();
      this.isDrawing = true;
      this.addCircle(event.clientX, event.clientY);
    }
  }

  onMouseRelease(event: MouseEvent): void {
    if(event.button === 0) { // 0 for the left mouse button
      this.isDrawing = false;
    }
  }

  onMouseMove(event: MouseEvent): void {
    if(this.isDrawing) {
      this.addCircle(event.clientX, event.clientY);
    } else {
      if(this.mousePointer !== undefined) {
        this.manipulator.removeChild(this.subElement, this.mousePointer);
      }
      this.mousePointer = this.createCircle(this.effectiveX(event.clientX), this.effectiveY(event.clientY));
      this.manipulator.appendChild(this.subElement, this.mousePointer);
    }
  }

  onDoubleClick(event: MouseEvent): void {}
  onClick(event: MouseEvent): void {}
  onKeyPressed(event: KeyboardEvent): void { }
  onKeyReleased(event: KeyboardEvent): void { }

  private updateProperties(): void {
    this.subElement = this.manipulator.createElement('g', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.subElement, SVGProperties.title, Tools.Pencil);
    this.manipulator.appendChild(this.image.nativeElement, this.subElement);
  }

  private addCircle(clientX: number, clientY: number): void {
    const circleToAdd = this.createCircle(this.effectiveX(clientX), this.effectiveY(clientY));
    this.circles.push_back(circleToAdd);
    this.manipulator.appendChild(this.subElement, circleToAdd);
  }

  private createCircle(x: number, y: number): SVGCircleElement {
    let circle: SVGCircleElement;
    circle = this.manipulator.createElement(SVGProperties.circle,'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(circle, SVGProperties.fill, this.color);
    this.manipulator.setAttribute(circle, SVGProperties.opacity, this.opacity);
    this.manipulator.setAttribute(circle, SVGProperties.radius, (this.thickness/2).toString());
    this.manipulator.setAttribute(circle, SVGProperties.centerX, x.toString());
    this.manipulator.setAttribute(circle, SVGProperties.centerY, y.toString());
    return circle;
  }
}
