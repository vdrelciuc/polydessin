import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { Coords } from 'src/app/classes/coordinates';

@Injectable({
  providedIn: 'root'
})
export abstract class DrawableService {

  abstract initialize(manipulator: Renderer2, image: ElementRef<SVGElement>): void;

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
}
