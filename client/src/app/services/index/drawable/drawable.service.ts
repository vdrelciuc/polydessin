import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { Coords } from 'src/app/classes/coordinates';
import { DrawablePropertiesService } from './properties/drawable-properties.service';

@Injectable({
  providedIn: 'root'
})
export abstract class DrawableService {

  protected manipulator: Renderer2;
  protected image: ElementRef<SVGElement>;
  protected attributes: DrawablePropertiesService;

  protected assignParams(manipulator: Renderer2, image: ElementRef<SVGElement>): void {
    this.manipulator = manipulator;
    this.image = image;
    this.attributes = new DrawablePropertiesService();
  }

  abstract initialize(manipulator: Renderer2, image: ElementRef<SVGElement>): void;
  abstract initializeProperties(attributes: DrawablePropertiesService): void;

  getCoords(pointer: MouseEvent): Coords {
    return new Coords(pointer.clientX, pointer.clientY);
  }

  canDraw(canvas: HTMLElement, pointer: MouseEvent): boolean {
    return (
        // To change depending on what is the canvas' type and how to get it's dimensions
      true
    );
  }

  abstract onMouseInCanvas(event: MouseEvent): void;
  abstract onMouseOutCanvas(event: MouseEvent): void;
  abstract onMousePress(event: MouseEvent): void;
  abstract onMouseRelease(event: MouseEvent): void;
  abstract onMouseMove(event: MouseEvent): void;
  abstract onDoubleClick(event: MouseEvent): void;
  abstract onClick(event: MouseEvent): void;
  abstract onKeyPressed(event: KeyboardEvent): void;
  abstract onKeyReleased(event: KeyboardEvent): void;

  protected effectiveX(onScreenX: number): number {
    return onScreenX - this.image.nativeElement.getBoundingClientRect().left;
  }

  protected effectiveY(onScreenY: number): number {
    return onScreenY - this.image.nativeElement.getBoundingClientRect().top;
  }
}
