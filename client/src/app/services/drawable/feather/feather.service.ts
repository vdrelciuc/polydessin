import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { DrawableService } from '../drawable.service';
import { ColorSelectorService } from '../../color-selector/color-selector.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';

@Injectable({
  providedIn: 'root'
})
export class FeatherService extends DrawableService {

  constructor() {
    super();
  }

  initialize(
    manipulator: Renderer2, 
    image: ElementRef<SVGElement>, 
    colorSelectorService: ColorSelectorService, 
    drawStack: DrawStackService): void {
      this.assignParams(manipulator, image, colorSelectorService, drawStack);
  }
}
