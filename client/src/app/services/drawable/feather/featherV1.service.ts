import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as CONSTANTS from 'src/app/classes/constants';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { ColorSelectorService } from '../../color-selector/color-selector.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { DrawableService } from '../drawable.service';

@Injectable({
  providedIn: 'root'
})
export class FeatherService extends DrawableService {

  thickness: BehaviorSubject<number>;
  height: BehaviorSubject<number>;
  angle: BehaviorSubject<number>;

  private altPressed: boolean;
  private canDraw: boolean;
  private preview: SVGLineElement;
  private readonly DEFAULT_THICKNESS: number = 1;
  private readonly DEFAULT_HEIGHT: number = 10;
  private readonly DEFAULT_ANGLE: number = 0;

  constructor() {
    super();
    this.thickness = new BehaviorSubject<number>(this.DEFAULT_THICKNESS);
    this.height = new BehaviorSubject<number>(this.DEFAULT_HEIGHT);
    this.angle = new BehaviorSubject<number>(this.DEFAULT_ANGLE);
    this.altPressed = false;
  }

  initialize(
    manipulator: Renderer2,
    image: ElementRef<SVGElement>,
    colorSelectorService: ColorSelectorService,
    drawStack: DrawStackService): void {
      this.assignParams(manipulator, image, colorSelectorService, drawStack);
  }

  onSelect(): void {
    this.subElement = this.manipulator.createElement(SVGProperties.g, SVGProperties.nameSpace);
    this.manipulator.appendChild(this.image.nativeElement, this.subElement);
  }

  endTool(): void {
    if (this.preview !== undefined) {
      this.preview.remove();
    }
    if (this.subElement !== undefined) {
      this.subElement.remove();
    }
  }

  onMouseOutCanvas(event: MouseEvent): void {
    this.canDraw = false;
    this.preview.remove();
  }

  onMouseInCanvas(event: MouseEvent): void {
    this.createPreview();
  }

  onMousePress(event: MouseEvent): void {
    if (event.button === CONSTANTS.LEFT_CLICK) {
      this.canDraw = true;
      this.onSelect();
    }
  }

  onMouseMove(event: MouseEvent): void {
    this.updatePreview(CoordinatesXY.getEffectiveCoords(this.image, event));
    if (this.canDraw) {
      this.manipulator.appendChild(this.subElement, this.preview.cloneNode(true));
    }
  }

  onMouseRelease(event: MouseEvent): void {
    this.canDraw = false;
    this.preview.remove();
    if (this.subElement.childElementCount > 0) {
      this.pushElement();
    }
    this.createPreview();
    this.updatePreview(CoordinatesXY.getEffectiveCoords(this.image, event));
  }

  onKeyPressed(event: KeyboardEvent): void {
    if (event.key === 'Alt') {
      this.altPressed = true;
    }
  }

  onKeyReleased(event: KeyboardEvent): void {
    if (event.key === 'Alt') {
      this.altPressed = false;
    }
  }

  onMouseWheel(event: WheelEvent): void {
    if (event.deltaY < 0) {
      this.updateAngle(true);
    } else {
      this.updateAngle(false);
    }
  }

  private createPreview(): void {
    this.preview = this.manipulator.createElement(SVGProperties.line, SVGProperties.nameSpace);
    this.manipulator.setAttribute(this.preview, SVGProperties.thickness, this.thickness.value.toString());
    this.manipulator.setAttribute(this.preview, SVGProperties.color, this.colorSelectorService.primaryColor.value.getHex());
    this.manipulator.appendChild(this.subElement, this.preview);
  }

  private updatePreview(mouse: CoordinatesXY): void {
    if (this.preview === undefined) {
      this.createPreview();
    }
    const endCoordiantes = CoordinatesXY.computeCoordinates(mouse, this.angle.value, this.height.value);
    this.manipulator.setAttribute(this.preview, SVGProperties.startX, mouse.getX().toString());
    this.manipulator.setAttribute(this.preview, SVGProperties.startY, mouse.getY().toString());
    this.manipulator.setAttribute(this.preview, SVGProperties.endX  , endCoordiantes.getX().toString());
    this.manipulator.setAttribute(this.preview, SVGProperties.endY  , endCoordiantes.getY().toString());
  }

  private updateAngle(direction: boolean): void {
    let factor = 1;
    if (!direction) {
      // tslint:disable-next-line: no-magic-numbers | Reason : -1 designates an exception
      factor = -1;
    }
    if (this.altPressed) {
      this.changeValue(CONSTANTS.MOUSE_ROLL_CHANGE_ALT, factor);
    } else {
      this.changeValue(CONSTANTS.MOUSE_ROLL_CHANGE, factor);
    }
  }

  private changeValue(factor: number, direction: number): void {
    let current = this.angle.value;
    current += factor * direction;
    if (this.condition(current, direction === 1 ? true : false)) {
      this.angle.next(current - CONSTANTS.MAX_ANGLE * direction);
    } else {
      this.angle.next(current);
    }
  }

  private condition(current: number, direction: boolean): boolean {
    return direction ? (current > CONSTANTS.MAX_ANGLE) : (current < CONSTANTS.MIN_ANGLE);
  }
}
