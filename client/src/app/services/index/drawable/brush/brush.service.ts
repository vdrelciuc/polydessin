import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { DrawableService } from '../drawable.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { Tools } from 'src/app/enums/tools';

@Injectable({
  providedIn: 'root'
})
export class BrushService extends DrawableService {

  thickness: number;
  isDrawing: boolean;
  subElement: SVGGElement;
  attributes: DrawablePropertiesService;

  constructor() {
    super(); 
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

  onMouseInCanvas(event: MouseEvent): void {
    this.updateProperties();
    this.onMouseMove(event);
  }
  onMouseOutCanvas(event: MouseEvent): void {
    console.log('Out of canvas');
    this.isDrawing = false;
  }
  onMousePress(event: MouseEvent): void {
    console.log('Mouse Pressed');
  }
  onMouseRelease(event: MouseEvent): void {
    if(event.button === 0) { // 0 for the left mouse button
      this.isDrawing = false;
    }
  }
  onMouseMove(event: MouseEvent): void {
    console.log('Moving');
  }
  onDoubleClick(event: MouseEvent): void {}

  onClick(event: MouseEvent): void {
    console.log('Mouse Clicked');
    if(event.button === 0) { // 0 for the left mouse button
      this.isDrawing = true;
      this.updateProperties();
      // Ajouter le premier point
    }
  }
  onKeyPressed(event: KeyboardEvent): void {}
  onKeyReleased(event: KeyboardEvent): void {}

  private updateProperties(): void {
    this.subElement = this.manipulator.createElement('g', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.subElement, SVGProperties.title, Tools.Pencil);
    this.manipulator.appendChild(this.image.nativeElement, this.subElement);
  }
}
