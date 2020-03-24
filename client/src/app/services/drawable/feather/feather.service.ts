import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { DrawableService } from '../drawable.service';
import { ColorSelectorService } from '../../color-selector/color-selector.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { BehaviorSubject } from 'rxjs';
import * as CONSTANTS from 'src/app/classes/constants';

@Injectable({
  providedIn: 'root'
})
export class FeatherService extends DrawableService {

  thickness: BehaviorSubject<number>;
  height: BehaviorSubject<number>;
  angle: BehaviorSubject<number>;

  private altPressed: boolean;

  constructor() {
    super();
    this.thickness = new BehaviorSubject<number>(1);
    this.height = new BehaviorSubject<number>(1);
    this.angle = new BehaviorSubject<number>(0);
    this.altPressed = false;
  }

  initialize(
    manipulator: Renderer2, 
    image: ElementRef<SVGElement>, 
    colorSelectorService: ColorSelectorService, 
    drawStack: DrawStackService): void {
      this.assignParams(manipulator, image, colorSelectorService, drawStack);
  }

  onKeyPressed(event: KeyboardEvent): void {
    if(event.key === 'Alt') {
      this.altPressed = true;
    }
  }

  onKeyReleased(event: KeyboardEvent): void {
    if(event.key === 'Alt') {
      this.altPressed = false;
    }
  }

  onMouseWheel(event: WheelEvent): void {
    if(event.deltaY < 0) {
      this.updateAngle(true);
    } else {
      this.updateAngle(false);
    }
    console.log(this.angle.value);
  }

  private updateAngle(direction: boolean): void {
    let factor = 1;
    if(!direction) {
      factor = -1;
    }
    if(this.altPressed) {
      this.changeValue(CONSTANTS.MOUSE_ROLL_CHANGE_ALT, factor);
    } else {
      this.changeValue(CONSTANTS.MOUSE_ROLL_CHANGE, factor);
    }
  }

  private changeValue(factor: number, direction: number) {
    let current = this.angle.value;
    current += factor * direction;
    if(this.condition(current, direction === 1 ? true : false)) {
      this.angle.next(current - CONSTANTS.MAX_ANGLE * direction);
    } else {
      this.angle.next(current);
    }
  }

  private condition(current: number, direction: boolean): boolean {
    return direction ? (current > CONSTANTS.MAX_ANGLE) : (current < CONSTANTS.MIN_ANGLE)
  }
}
