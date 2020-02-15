import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { ColorSelectorService } from '../../color-selector.service';
import { DrawablePropertiesService } from './properties/drawable-properties.service';
import { DrawStackService } from '../../tools/draw-stack/draw-stack.service';

@Injectable({
  providedIn: 'root'
})
export abstract class DrawableService {

  protected manipulator: Renderer2;
  protected image: ElementRef<SVGElement>;
  protected attributes: DrawablePropertiesService;
  protected colorSelectorService: ColorSelectorService;
  protected drawStack: DrawStackService;
  frenchName: string;

  protected assignParams(
    manipulator: Renderer2, 
    image: ElementRef<SVGElement>,
    colorSelectorService: ColorSelectorService,
    drawStack: DrawStackService): void {
    this.manipulator = manipulator;
    this.image = image;
    this.colorSelectorService = colorSelectorService;
    this.drawStack = drawStack;
    this.attributes = new DrawablePropertiesService();
  }

  abstract initialize(
    manipulator: Renderer2, 
    image: ElementRef<SVGElement>,
    colorSelectorService: ColorSelectorService,
    drawStack: DrawStackService
    ): void;
  abstract initializeProperties(): void;

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
