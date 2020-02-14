import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { DrawableService } from '../drawable.service';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';

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
}
