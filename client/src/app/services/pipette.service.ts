import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { CoordinatesXY } from '../classes/coordinates-x-y';
import { SVGProperties } from '../classes/svg-properties';
import { ColorSelectorService } from './color-selector.service';
import { DrawableService } from './index/drawable/drawable.service';
import { DrawablePropertiesService } from './index/drawable/properties/drawable-properties.service';
import { DrawStackService } from './tools/draw-stack/draw-stack.service';
import { Color } from '../classes/color';
import { ColorType } from '../enums/color-types';

@Injectable({
  providedIn: 'root',
})
export class PipetteService extends DrawableService {
  readonly LEFT_CLICK = 0;
  readonly WHEEL_CLICK = 1;
  readonly RIGHT_CLICK = 2;

  constructor() {
    super();
  }

  initialize(manipulator: Renderer2,
             image: ElementRef<SVGElement>,
             colorSelectorService: ColorSelectorService,
             drawStack: DrawStackService): void {
    this.initializeProperties();
    this.assignParams(manipulator, image, colorSelectorService, drawStack);
  }

  initializeProperties(): void {}

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
    const position = new CoordinatesXY(event.clientX, event.clientY);
    const svgElement = this.drawStack.findTopElementAt(position);
    if (svgElement !== undefined) {
      const capturedSVG = svgElement.target.firstChild as SVGElement;
      const targetedColor = capturedSVG.getAttribute(SVGProperties.fill);
      if (targetedColor !== null) {
         if (event.button === this.LEFT_CLICK) {
           this.colorSelectorService.colorToChange = ColorType.Primary;
         } else if (event.button === this.RIGHT_CLICK) {
           this.colorSelectorService.colorToChange = ColorType.Secondary;
         }
         this.colorSelectorService.updateColor(new Color(targetedColor));
      }
    }
  }
}
