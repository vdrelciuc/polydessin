import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { ColorSelectorService } from './color-selector.service';
import { DrawableService } from './index/drawable/drawable.service';
import { DrawablePropertiesService } from './index/drawable/properties/drawable-properties.service';
import { DrawStackService } from './tools/draw-stack/draw-stack.service';
import { CoordinatesXY } from '../classes/coordinates-x-y';

@Injectable({
  providedIn: 'root'
})
export class PipetteService extends DrawableService {

  constructor() {
    super();
  }

  initialize(manipulator: Renderer2,
             image: ElementRef<SVGElement>,
             colorSelectorService: ColorSelectorService,
             drawStack: DrawStackService): void {
    this.initializeProperties(colorSelectorService);
    this.assignParams(manipulator, image, colorSelectorService, drawStack);
  }

  initializeProperties(colorSelectorService: ColorSelectorService): void {
  }

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
  onClick(event: MouseEvent): void {
    const effectiveX = CoordinatesXY.effectiveX(this.image, event.clientX);
    const effectiveY = CoordinatesXY.effectiveX(this.image, event.clientY);
    const position = new CoordinatesXY(effectiveX, effectiveY);

  }
}
