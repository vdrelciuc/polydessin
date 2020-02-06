import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { DrawablePropertiesService } from './properties/drawable-properties.service';
import { ColorSelectorService } from '../../color-selector.service';

@Injectable({
  providedIn: 'root'
})
export abstract class DrawableService {

  protected manipulator: Renderer2;
  protected image: ElementRef<SVGElement>;
  protected attributes: DrawablePropertiesService;
  protected colorSelectorService: ColorSelectorService;
  frenchName: string;

  protected assignParams(manipulator: Renderer2, image: ElementRef<SVGElement>,
      colorSelectorService: ColorSelectorService): void {
    this.manipulator = manipulator;
    this.image = image;
    this.colorSelectorService = colorSelectorService;
    this.attributes = new DrawablePropertiesService();
  }

  abstract initialize(manipulator: Renderer2, image: ElementRef<SVGElement>, 
    colorSelectorService: ColorSelectorService): void;
  abstract initializeProperties(colorSelectorService: ColorSelectorService): void;

  canDraw(canvas: HTMLElement, pointer: MouseEvent): boolean {
    return (
        // To change depending on what is the canvas' type and how to get it's dimensions
      true
    );
  }

  onMouseInCanvas(event: MouseEvent): void { /*To Override if needed*/}
  onMouseOutCanvas(event: MouseEvent): void { /*To Override if needed*/}
  onMousePress(event: MouseEvent): void { /*To Override if needed*/}
  onMouseRelease(event: MouseEvent): void { /*To Override if needed*/}
  onMouseMove(event: MouseEvent): void { /*To Override if needed*/}
  onDoubleClick(event: MouseEvent): void { /*To Override if needed*/}
  onClick(event: MouseEvent): void { /*To Override if needed*/}
  onKeyPressed(event: KeyboardEvent): void { /*To Override if needed*/}
  onKeyReleased(event: KeyboardEvent): void { /*To Override if needed*/}
}
