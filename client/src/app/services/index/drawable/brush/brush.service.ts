import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { DrawableService } from '../drawable.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';

@Injectable({
  providedIn: 'root'
})
export class BrushService extends DrawableService {

  constructor() {
    super();
   }

  initialize(manipulator: Renderer2, image: ElementRef<SVGElement>): void {
    this.assignParams(manipulator, image);
  }
  initializeProperties(attributes: DrawablePropertiesService): void {
    
  }
  onMouseInCanvas(event: MouseEvent): void {
    throw new Error("Method not implemented.");
  }
  onMouseOutCanvas(event: MouseEvent): void {
    throw new Error("Method not implemented.");
  }
  onMousePress(event: MouseEvent): void {
    throw new Error("Method not implemented.");
  }
  onMouseRelease(event: MouseEvent): void {
    throw new Error("Method not implemented.");
  }
  onMouseMove(event: MouseEvent): void {
    throw new Error("Method not implemented.");
  }
  onDoubleClick(event: MouseEvent): void {
    throw new Error("Method not implemented.");
  }
  onClick(event: MouseEvent): void {
    throw new Error("Method not implemented.");
  }
  onKeyPressed(event: KeyboardEvent): void {
    throw new Error("Method not implemented.");
  }
  onKeyReleased(event: KeyboardEvent): void {
    throw new Error("Method not implemented.");
  }
}
