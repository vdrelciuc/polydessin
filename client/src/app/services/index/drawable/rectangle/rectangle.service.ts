import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { Coords } from 'src/app/classes/coordinates';
import { DrawableService } from '../drawable.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { Tools } from 'src/app/enums/tools';

@Injectable({
  providedIn: 'root'
})
export class RectangleService extends DrawableService{

  attributes: DrawablePropertiesService;
  //height: number;
  //width: number;
  thickness: number;
  borderColor: string;
  fillColor: string;
  opacity: string;
  // private isDone: boolean;
  // private isStarted: boolean;
  private isChanging: boolean;
  // private points: Stack<CoordinatesXY>;
  // private circles: Stack<SVGCircleElement>;
  private shapeOrigin: Coords;
  private rectangle: SVGRectElement;
  private subElement: SVGGElement;
   //private shiftPressed: boolean;

  constructor() { 
    super();
  }

  initialize(manipulator: Renderer2, image: ElementRef): void {
    this.assignParams(manipulator, image);
    //this.shiftPressed = false;
  }
  initializeProperties(attributes: DrawablePropertiesService) {
    this.attributes = attributes;
    this.thickness = this.attributes.thickness.value;

    this.attributes.thickness.subscribe((element: number) => {
        this.thickness = element;
    });

    this.attributes.color.subscribe((element: string) => {
      this.borderColor = element;
    })

    this.attributes.fillColor.subscribe((element: string) => {
      this.fillColor = element;
    })
  }
  onMouseInCanvas(event: MouseEvent): void {
    console.log('in canvas');
  }
  onMouseOutCanvas(event: MouseEvent): void {
    console.log('out of canvas');
  }
  onMousePress(event: MouseEvent): void {
    this.shapeOrigin = this.getEffectiveCoords(event);
    this.updateProperties();
    this.isChanging = true;
  }
  onMouseRelease(event: MouseEvent): void {
    this.isChanging = false;
  }
  onMouseMove(event: MouseEvent): void {
    if(!this.isChanging) return;

    let newWidth = this.effectiveX(event.clientX) - this.shapeOrigin.x;
    let newHeight = this.effectiveY(event.clientY) - this.shapeOrigin.y;
    this.updateSize(newWidth, newHeight);
  }
  onDoubleClick(event: MouseEvent): void {
    //throw new Error("Method not implemented.");
  }
  onClick(event: MouseEvent): void {
    // throw new Error("Method not implemented.");
  }
  onKeyPressed(event: KeyboardEvent): void {
    //throw new Error("Method not implemented.");
  }
  onKeyReleased(event: KeyboardEvent): void {
    //throw new Error("Method not implemented.");
  }

  private updateSize(width: number = 0, height: number = 0): void {
    this.manipulator.setAttribute(this.rectangle, SVGProperties.width, width.toString());
    this.manipulator.setAttribute(this.rectangle, SVGProperties.height, height.toString());
  }

  private updateProperties(): void {
    this.subElement = this.manipulator.createElement('g', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.subElement, SVGProperties.title, Tools.Rectangle);
    this.rectangle = this.manipulator.createElement(SVGProperties.rectangle,'http://www.w3.org/2000/svg');

    this.updateSize(); // Width and height can't be tempered with in attribute

    this.manipulator.setAttribute(this.rectangle, SVGProperties.x, this.shapeOrigin.x.toString());
    this.manipulator.setAttribute(this.rectangle, SVGProperties.y, this.shapeOrigin.y.toString());
    this.manipulator.setAttribute(this.rectangle, SVGProperties.fill, this.fillColor);
    this.manipulator.setAttribute(this.rectangle, SVGProperties.thickness, this.thickness.toString());
    this.manipulator.setAttribute(this.rectangle, SVGProperties.color, this.borderColor);
    this.manipulator.setAttribute(this.rectangle, SVGProperties.opacity, this.opacity);

    this.manipulator.appendChild(this.subElement, this.rectangle);
    this.manipulator.appendChild(this.image.nativeElement, this.subElement);
  }
}
