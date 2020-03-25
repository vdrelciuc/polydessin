import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { DrawableService } from '../drawable.service';
import { ColorSelectorService } from '../../color-selector/color-selector.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import * as CONSTANTS from 'src/app/classes/constants';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';

@Injectable({
  providedIn: 'root'
})
export class FeatherService extends DrawableService {

  readonly thickness: number = 1;
  height: number;
  angle: number;
  private path: string;
  private position: number;

  private isDrawing: boolean;
  private preview: SVGLineElement;
  private polygon: SVGPolygonElement;

  constructor() {
    super();
    this.height = 10;
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

    this.polygon = this.manipulator.createElement(SVGProperties.polygon, SVGProperties.nameSpace);
    this.manipulator.appendChild(this.subElement, this.polygon);
    this.manipulator.setAttribute(this.polygon, SVGProperties.fill, this.colorSelectorService.primaryColor.value.getHex());
    this.manipulator.setAttribute(this.polygon, SVGProperties.fillOpacity, this.colorSelectorService.primaryTransparency.value.toString());
    this.manipulator.setAttribute(this.polygon, 'fill-rule', 'nonzero');

    this.path = '';
    this.position = 0;
  }

  endTool(): void {
    if (this.isDrawing) {
      this.subElement.remove();
      delete(this.subElement);
      this.isDrawing = false;
    }
    if (this.preview !== undefined) {
      this.preview.remove();
      delete(this.preview);
    }
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
    if (this.preview !== undefined) {
      this.preview.remove();
      delete(this.preview);
    }
    if (event.button === CONSTANTS.LEFT_CLICK) {
      this.isDrawing = true;
      this.onSelect();
      const firstPoint =
        new CoordinatesXY(CoordinatesXY.effectiveX(this.image, event.clientX) + 1, CoordinatesXY.effectiveY(this.image, event.clientY) + 1);
      this.addPath(firstPoint);
      this.addPath(CoordinatesXY.getEffectiveCoords(this.image, event));
    }
  }
  addPath(mouse: CoordinatesXY): void {
    const firstPoint = CoordinatesXY.computeCoordinates(mouse, this.angle, this.height / 2);
    const firstPointString = `${firstPoint.getX()},${firstPoint.getY()} `;
    const secondPoint = CoordinatesXY.computeCoordinates(mouse, this.angle, -this.height / 2);
    const secondPointString = `${secondPoint.getX()},${secondPoint.getY()} `;

    this.path = this.path.slice(0, this.position) + firstPointString + secondPointString + this.path.slice(this.position);
    this.position += firstPointString.length;
    this.manipulator.setAttribute(this.polygon, SVGProperties.points, this.path);
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
    this.updatePreview(CoordinatesXY.getEffectiveCoords(this.image, event));
  }

  onMouseWheel(event: WheelEvent): void {
    let delta = (event.altKey ? CONSTANTS.MOUSE_ROLL_CHANGE_ALT : CONSTANTS.MOUSE_ROLL_CHANGE);
    delta *= (event.deltaY < 0 ? 1 : -1);
    this.angle += delta;
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
