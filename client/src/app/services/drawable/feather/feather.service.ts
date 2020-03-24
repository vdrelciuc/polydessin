import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { DrawableService } from '../drawable.service';
import { ColorSelectorService } from '../../color-selector/color-selector.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeatherService extends DrawableService {

  thickness: BehaviorSubject<number>;
  height: BehaviorSubject<number>;
  angle: BehaviorSubject<number>;

  constructor() {
    super();
    this.thickness = new BehaviorSubject<number>(1);
    this.height = new BehaviorSubject<number>(1);
    this.angle = new BehaviorSubject<number>(0);
  }

  initialize(
    manipulator: Renderer2, 
    image: ElementRef<SVGElement>, 
    colorSelectorService: ColorSelectorService, 
    drawStack: DrawStackService): void {
      this.assignParams(manipulator, image, colorSelectorService, drawStack);
  }
}
