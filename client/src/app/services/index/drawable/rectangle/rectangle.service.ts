import { Injectable, Renderer2, ElementRef } from '@angular/core';
import {invertColor} from 'src/app/classes/color-inverter';
import { Coords } from 'src/app/classes/coordinates';
import { DrawableService } from '../drawable.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { Tools } from 'src/app/enums/tools';
// import { ShapeProperties } from 'src/app/classes/shape-properties';

@Injectable({
  providedIn: 'root'
})
export class RectangleService extends DrawableService{

  attributes: DrawablePropertiesService;
  //shapeProperties: ShapeProperties;
  thickness: number;
  borderColor: string;
  fillColor: string;
  opacity: string;

  hasContour: boolean;
  hasFill: boolean;
  
  private mousePosition: Coords;
  private shapeOrigin: Coords;

  private isChanging: boolean;
  private shiftPressed: boolean;
  private mousePositionOnShiftPress: Coords;

  private rectangle: SVGRectElement;
  private text: SVGTextElement;
  private subElement: SVGGElement;

  constructor() { 
    super();

  }

  initialize(manipulator: Renderer2, image: ElementRef): void {
    this.assignParams(manipulator, image);
    this.shiftPressed = false;
    this.hasContour = false;
    this.hasFill = false;
  }
  initializeProperties(attributes: DrawablePropertiesService) {
    this.attributes = attributes;
    this.thickness = this.attributes.thickness.value;
    /*
    this.attributes.thickness.subscribe((element: number) => {
      this.thickness = element;
    });
    */
    this.attributes.color.subscribe((element: string) => {
      this.borderColor = element;
    });

    this.attributes.fillColor.subscribe((element: string) => {
      this.fillColor = element;
    });
  }
  onMouseInCanvas(event: MouseEvent): void {
    console.log('in canvas');
  }
  onMouseOutCanvas(event: MouseEvent): void {
    console.log('out of canvas');
  }
  onMousePress(event: MouseEvent): void {
    if((this.hasContour || this.hasFill) && this.thickness !== 0) {
      this.shapeOrigin = this.getEffectiveCoords(event);
      this.mousePosition = this.getEffectiveCoords(event);
      this.updateProperties();
      this.isChanging = true;
    }
    
  }
  onMouseRelease(event: MouseEvent): void {
    this.isChanging = false;
    this.manipulator.removeChild(this.subElement, this.text); // Will be destroyed automatically
  }
  onMouseMove(event: MouseEvent): void {
    if(this.isChanging) {
      this.mousePosition = this.getEffectiveCoords(event); // Save mouse position for KeyPress Event
      this.updateSize();
    }
  }
  onDoubleClick(event: MouseEvent): void {
    //throw new Error("Method not implemented.");
  }
  onClick(event: MouseEvent): void {
    // throw new Error("Method not implemented.");
  }
  onKeyPressed(event: KeyboardEvent): void {
    if(event.shiftKey && !this.shiftPressed && this.isChanging) {
      console.log("Shift pressed");
      this.shiftPressed = true;
      this.updateSize();
    }
  }
  onKeyReleased(event: KeyboardEvent): void {
    if(!event.shiftKey && this.shiftPressed) {
      console.log("Shift released");
      this.shiftPressed = false;
      this.mousePosition = new Coords(this.mousePositionOnShiftPress.x, this.mousePositionOnShiftPress.y);
      if (this.isChanging)
      this.updateSize();
    }
  }

  private updateSize(): void {
    let width = Math.abs(this.mousePosition.x - this.shapeOrigin.x);
    let height = Math.abs(this.mousePosition.y - this.shapeOrigin.y);

    if (this.shiftPressed) {
      this.mousePositionOnShiftPress = new Coords(this.mousePosition.x, this.mousePosition.y);
      let quadrant = this.getQuadrant();
      if (width > height) {
        if (quadrant === 2 || quadrant === 3) this.mousePosition.x = this.mousePosition.x + (width - height); // Faking mouse position
        width = height;
      } else {
        if (quadrant === 1 || quadrant === 2) this.mousePosition.y = this.mousePosition.y + (height - width); // Faking mouse position
        height = width;
      }
    }

    this.manipulator.setAttribute(this.rectangle, SVGProperties.width, width.toString());
    this.manipulator.setAttribute(this.rectangle, SVGProperties.height, height.toString());
    this.alignRectangleOrigin(width, height);
  }

  private updateProperties(): void {
    // Creating elements
    this.subElement = this.manipulator.createElement('g', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.subElement, SVGProperties.title, Tools.Rectangle);
    this.rectangle = this.manipulator.createElement(SVGProperties.rectangle,'http://www.w3.org/2000/svg');
    this.text = this.manipulator.createElement('text','http://www.w3.org/2000/svg');

    // Adding rectangle and text properties
    this.manipulator.setAttribute(this.rectangle, SVGProperties.x, this.shapeOrigin.x.toString());
    this.manipulator.setAttribute(this.rectangle, SVGProperties.y, this.shapeOrigin.y.toString());
    this.manipulator.setAttribute(this.rectangle, SVGProperties.fill, this.hasFill ? this.fillColor : 'none');
    this.manipulator.setAttribute(this.rectangle, SVGProperties.thickness, this.hasContour ? this.thickness.toString() : '0');
    this.manipulator.setAttribute(this.rectangle, SVGProperties.color, 'red');
    this.manipulator.setAttribute(this.rectangle, SVGProperties.opacity, this.opacity);
    
    this.manipulator.setAttribute(this.text, SVGProperties.fill, invertColor(this.fillColor, true));
    this.manipulator.setAttribute(this.text, 'text-anchor', 'middle');
    
    this.updateSize(); // Width and height can't be tempered with in attribute

    // Adding elements to DOM
    this.manipulator.appendChild(this.subElement, this.rectangle);
    this.manipulator.appendChild(this.subElement, this.text);
    this.manipulator.appendChild(this.image.nativeElement, this.subElement);
  }

  private getQuadrant(): 1 | 2 | 3 | 4 {
    //    2 | 1
    //   ---|---
    //    3 | 4

    let isTop = this.mousePosition.y < this.shapeOrigin.y;
    let isLeft = this.mousePosition.x < this.shapeOrigin.x;

    return isTop? (isLeft ? 2 : 1) : (isLeft ? 3 : 4);
  }

  private alignRectangleOrigin(width: number, height: number) {
    let quadrant = this.getQuadrant();

    if (quadrant === 1 || quadrant === 4) {
      this.manipulator.setAttribute(this.rectangle, SVGProperties.x, this.shapeOrigin.x.toString());
      this.manipulator.setAttribute(this.text, SVGProperties.x, (this.shapeOrigin.x + width / 2).toString());
    } else {
      this.manipulator.setAttribute(this.rectangle, SVGProperties.x, this.mousePosition.x.toString());
      this.manipulator.setAttribute(this.text, SVGProperties.x, (this.mousePosition.x + width / 2).toString());
    }
    
    if(quadrant === 3 || quadrant === 4) {
      this.manipulator.setAttribute(this.rectangle, SVGProperties.y, this.shapeOrigin.y.toString());
      this.manipulator.setAttribute(this.text, SVGProperties.y, (this.shapeOrigin.y + height / 2).toString());
    } else {
      this.manipulator.setAttribute(this.rectangle, SVGProperties.y, this.mousePosition.y.toString());
      this.manipulator.setAttribute(this.text, SVGProperties.y, (this.mousePosition.y + height / 2).toString());
    }

    this.updateTextSize(width, height);
  }

  private updateTextSize(width: number, height: number) {
    if(width > 40 && height > 15) {
      this.text.innerHTML = '[Rectangle]';
    } else {
      this.text.innerHTML = '';
    }
    
    this.manipulator.setAttribute(this.text, 'font-size', (Math.min(height, width) / 6).toString());
  }
}
