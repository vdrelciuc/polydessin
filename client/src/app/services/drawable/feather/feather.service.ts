import { ElementRef, Injectable, Renderer2 } from '@angular/core';
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

  readonly thickness: number = 1;
  height: number;
  angle: number;

  private previousMouse: CoordinatesXY;
  private isDrawing: boolean;
  private preview: SVGLineElement;
  private readonly DEFAULT_HEIGHT: number = 10;

  constructor() {
    super();
    this.height = this.DEFAULT_HEIGHT;
    this.angle = 0;
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
    if (this.isDrawing) {
      // this.subElement.remove();
      delete(this.subElement);
      this.isDrawing = false;
    }
    if (this.preview !== undefined) {
      this.preview.remove();
      delete(this.preview);
    }
    this.subElement.remove();
  }

  onMouseOutCanvas(event: MouseEvent): void {
    if (this.isDrawing) {
      this.onMouseMove(event);
      this.isDrawing = false;
      this.pushElement();
    }
    if (this.preview !== undefined) {
      this.preview.remove();
      delete(this.preview);
    }
    this.isDrawing = false;
  }

  onMouseInCanvas(event: MouseEvent): void {
    this.updatePreview(CoordinatesXY.getEffectiveCoords(this.image, event));
  }

  onMousePress(event: MouseEvent): void {
    if (this.preview !== undefined && event.button === CONSTANTS.LEFT_CLICK) {
      this.manipulator.appendChild(this.subElement, this.preview.cloneNode());
      this.preview.remove();
      delete(this.preview);

      this.isDrawing = true;
      this.previousMouse = CoordinatesXY.getEffectiveCoords(this.image, event);
    }
  }
  addPath(mouse: CoordinatesXY): void {
    if (this.previousMouse.distanceTo(mouse) > 0) {
      const polygon = this.manipulator.createElement(SVGProperties.polygon, SVGProperties.nameSpace);
      this.manipulator.appendChild(this.subElement, polygon);
      this.manipulator.setAttribute(polygon, SVGProperties.fill, this.colorSelectorService.primaryColor.value.getHex());
      this.manipulator.setAttribute(polygon, SVGProperties.fillOpacity, this.colorSelectorService.primaryTransparency.value.toString());
      const firstPoint = CoordinatesXY.computeCoordinates(this.previousMouse, this.angle, this.height / 2);
      const secondPoint = CoordinatesXY.computeCoordinates(this.previousMouse, this.angle, -this.height / 2);
      const thirdPoint = CoordinatesXY.computeCoordinates(mouse, this.angle, -this.height / 2);
      const forthPoint = CoordinatesXY.computeCoordinates(mouse, this.angle, this.height / 2);

      // let backShiftX = 0;
      // let backShiftY = 0;
      // backShiftX = firstPoint.getX() > forthPoint.getX() ? 1 : -1;
      // backShiftY = firstPoint.getY() > forthPoint.getY() ? 1 : -1;

      const points = `${firstPoint.getX()},${firstPoint.getY()} ` +
                     `${secondPoint.getX()},${secondPoint.getY()} ` +
                     `${thirdPoint.getX()},${thirdPoint.getY()} ` +
                     `${forthPoint.getX()},${forthPoint.getY()}`;
      this.manipulator.setAttribute(polygon, SVGProperties.points, points);
      this.previousMouse = mouse;
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isDrawing) {
      this.addPath(CoordinatesXY.getEffectiveCoords(this.image, event));
    } else {
      this.updatePreview(CoordinatesXY.getEffectiveCoords(this.image, event));
    }
  }

  onMouseRelease(event: MouseEvent): void {
    this.isDrawing = false;
    this.onMouseMove(event);
    this.pushElement();
    this.onSelect();
    this.updatePreview(CoordinatesXY.getEffectiveCoords(this.image, event));
  }

  onMouseWheel(event: WheelEvent): void {
    let delta = (event.altKey ? CONSTANTS.MOUSE_ROLL_CHANGE_ALT : CONSTANTS.MOUSE_ROLL_CHANGE);
    // tslint:disable-next-line: no-magic-numbers | Reason: -1 designates an exception
    delta *= (event.deltaY < 0 ? 1 : -1);
    this.angle += delta;
    // tslint:disable-next-line: no-magic-numbers | Reason: 360 is a full circle
    if (this.angle >= 360) { this.angle -= 360; }
    // tslint:disable-next-line: no-magic-numbers | Reason: 360 is a full circle
    if (this.angle < 0) { this.angle += 360; }
    this.updatePreview(CoordinatesXY.getEffectiveCoords(this.image, event));
  }

  private createPreview(): void {
    this.preview = this.manipulator.createElement(SVGProperties.line, SVGProperties.nameSpace);
    this.manipulator.setAttribute(this.preview, SVGProperties.thickness, this.thickness.toString());
    this.manipulator.setAttribute(this.preview, SVGProperties.color, this.colorSelectorService.primaryColor.value.getHex());
    this.manipulator.appendChild(this.subElement, this.preview);
  }

  private updatePreview(mouse: CoordinatesXY): void {
    if (this.preview === undefined) {
      this.createPreview();
    }
    const firstPoint = CoordinatesXY.computeCoordinates(mouse, this.angle, this.height / 2);
    const secondPoint = CoordinatesXY.computeCoordinates(mouse, this.angle, -this.height / 2);
    this.manipulator.setAttribute(this.preview, SVGProperties.startX, firstPoint.getX().toString());
    this.manipulator.setAttribute(this.preview, SVGProperties.startY, firstPoint.getY().toString());
    this.manipulator.setAttribute(this.preview, SVGProperties.endX  , secondPoint.getX().toString());
    this.manipulator.setAttribute(this.preview, SVGProperties.endY  , secondPoint.getY().toString());
  }
}
