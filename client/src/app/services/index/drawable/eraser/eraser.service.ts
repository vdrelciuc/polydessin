import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { DrawableService } from '../drawable.service';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import * as CONSTANTS from '../../../../classes/constants';

@Injectable({
  providedIn: 'root'
})
export class EraserService extends DrawableService {

  thickness: number;

  constructor() { 
    super();
    this.frenchName = 'Efface';
  }

  initialize(
    manipulator: Renderer2, 
    image:ElementRef<SVGElement>, 
    colorSelectorService: ColorSelectorService, 
    drawStack: DrawStackService): void {
      this.assignParams(manipulator, image, colorSelectorService, drawStack);
      this.initializeProperties();
  }

  initializeProperties(): void {
    this.thickness = this.attributes.thickness.value;
    this.attributes.thickness.subscribe((element: number) => {
      this.thickness = element;
    });
  }

  onMouseMove(event: MouseEvent): void {
    let elementOnTop = this.drawStack.findTopElementAt(new CoordinatesXY(
        CoordinatesXY.effectiveX(this.image, event.clientX), 
        CoordinatesXY.effectiveY(this.image, event.clientY)));
    if(elementOnTop !== undefined) {
      console.log('Found element');
      this.manipulator.setProperty(elementOnTop, SVGProperties.color, CONSTANTS.ERASER_OUTLINE);
    }
  }
}
