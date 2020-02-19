import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { DrawableService } from '../drawable.service';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { Tools } from 'src/app/enums/tools';

@Injectable({
  providedIn: 'root'
})
export class SelectionService extends DrawableService {

  private mousePosition: CoordinatesXY;
  private shapeOrigin: CoordinatesXY;
  private isChanging: boolean;

  private subElement: SVGGElement;
  private perimeter: SVGRectElement;
  private perimeterAlternative: SVGRectElement;

  constructor() {
    super();
    this.frenchName = 'Sélection';
  }

  initialize(manipulator: Renderer2, image: ElementRef, colorSelectorService: ColorSelectorService, drawStack: DrawStackService): void {
    this.assignParams(manipulator, image, colorSelectorService, drawStack);
  }

  initializeProperties(): void {
  }

  onMousePress(event: MouseEvent): void {
    if (this.isChanging) {
      // This case happens if the mouse button was released out of canvas: the shaped is confirmed on next mouse click
      this.onMouseRelease(event);
    } else {
      this.shapeOrigin = CoordinatesXY.getEffectiveCoords(this.image, event);
      this.setupProperties();
      this.isChanging = true;
    }

  }

  onMouseRelease(event: MouseEvent): void {
    this.isChanging = false;
    this.manipulator.removeChild(this.image.nativeElement, this.subElement); // Will be destroyed automatically when detached
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isChanging) {
      this.mousePosition = CoordinatesXY.getEffectiveCoords(this.image, event); // Save mouse position for KeyPress Event
      this.updateSize();
    }
  }

  protected updateSize(): void {
    let width = Math.abs(this.mousePosition.getX() - this.shapeOrigin.getX());
    let height = Math.abs(this.mousePosition.getY() - this.shapeOrigin.getY());

    // Set dimensions attributes for perimeter
    this.manipulator.setAttribute(this.perimeter, SVGProperties.width, width.toString());
    this.manipulator.setAttribute(this.perimeter, SVGProperties.height, height.toString());
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.width, width.toString());
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.height, height.toString());

    // Set dimensions attributes for shape
    this.alignShapeOrigin(width, height);
  }

  protected setupProperties(): void {
    // Creating perimeter
    this.subElement = this.manipulator.createElement('g', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.subElement, SVGProperties.title, Tools.Selection);
    this.perimeter = this.manipulator.createElement(SVGProperties.rectangle, 'http://www.w3.org/2000/svg');
    this.perimeterAlternative = this.manipulator.createElement(SVGProperties.rectangle, 'http://www.w3.org/2000/svg');

    // Adding perimeter properties
    const backgroundColor = this.colorSelectorService.backgroundColor.getValue();
    this.manipulator.setAttribute(this.perimeter, SVGProperties.fill, 'none');
    this.manipulator.setAttribute(this.perimeter, SVGProperties.color, backgroundColor.getInvertedColor(true).getHex());
    this.manipulator.setAttribute(this.perimeter, SVGProperties.thickness, '1');
    this.manipulator.setAttribute(this.perimeter, SVGProperties.dashedBorder, '4, 4');

    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.fill, 'none');
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.color, backgroundColor.getHex());
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.thickness, '1');
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.dashedBorder, '4, 4');
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.dashedBorderOffset, '4');

    // Adding perimeter to DOM
    this.manipulator.appendChild(this.subElement, this.perimeter);
    this.manipulator.appendChild(this.subElement, this.perimeterAlternative);
    this.manipulator.appendChild(this.image.nativeElement, this.subElement);
  }

  protected alignShapeOrigin(width: number, height: number): void {
    const quadrant = this.mousePosition.getQuadrant(this.shapeOrigin);

    if (quadrant === 1 || quadrant === 4) {
      this.manipulator.setAttribute(this.perimeter, SVGProperties.x, this.shapeOrigin.getX().toString());
      this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.x, this.shapeOrigin.getX().toString());
    } else {
      this.manipulator.setAttribute(this.perimeter, SVGProperties.x, this.mousePosition.getX().toString());
      this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.x, this.mousePosition.getX().toString());
    }

    if (quadrant === 3 || quadrant === 4) {
      this.manipulator.setAttribute(this.perimeter, SVGProperties.y, this.shapeOrigin.getY().toString());
      this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.y, this.shapeOrigin.getY().toString());
    } else {
      this.manipulator.setAttribute(this.perimeter, SVGProperties.y, this.mousePosition.getY().toString());
      this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.y, this.mousePosition.getY().toString());
    }
  }
}
