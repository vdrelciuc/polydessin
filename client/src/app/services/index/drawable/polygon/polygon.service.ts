import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { Color } from 'src/app/classes/color';
import * as CONSTANT from 'src/app/classes/constants';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { ShapeStyle } from 'src/app/classes/shape-style';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { Tools } from 'src/app/enums/tools';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawableService } from '../drawable.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';

@Injectable({
  providedIn: 'root'
})
export class PolygonService extends DrawableService {

  attributes: DrawablePropertiesService;

  shapeStyle: ShapeStyle;
  nSides: number;

  protected shapeCorner: CoordinatesXY;
  protected shapeOrigin: CoordinatesXY;
  protected radius: number;
  protected isChanging: boolean;

  protected subElement: SVGGElement;
  protected polygon: SVGPolygonElement;

  private shapeIsEmpty: boolean;

  constructor() {
    super();
    this.nSides = 3;
    this.shapeIsEmpty = true;
    this.frenchName = 'Polygone';
    this.shapeStyle = {
      thickness: CONSTANT.THICKNESS_DEFAULT,
      borderColor: new Color(),
      fillColor: new Color(),
      borderOpacity: CONSTANT.OPACITY_DEFAULT,
      fillOpacity: CONSTANT.OPACITY_DEFAULT,
      hasBorder: true,
      hasFill: true,
      nameDisplayDefault: '[shapeName]',
      nameDisplayOnShift: 'none'
    };
  }

  initialize(manipulator: Renderer2, image: ElementRef, colorSelectorService: ColorSelectorService): void {
    this.assignParams(manipulator, image, colorSelectorService);
  }

  initializeProperties(): void {
    this.colorSelectorService.primaryColor.subscribe((color: Color) => {
      this.shapeStyle.fillColor = color;
    });

    this.colorSelectorService.secondaryColor.subscribe((color: Color) => {
      this.shapeStyle.borderColor = color;
    });

    this.colorSelectorService.primaryTransparency.subscribe((opacity: number) => {
      this.shapeStyle.fillOpacity = opacity;
    });

    this.colorSelectorService.secondaryTransparency.subscribe((opacity: number) => {
      this.shapeStyle.borderOpacity = opacity;
    });
  }

  onMousePress(event: MouseEvent): void {
    if (this.isChanging) {
      // This case happens if the mouse button was released out of canvas: the shaped is confirmed on next mouse click
      this.onMouseRelease(event);
    } else if ((this.shapeStyle.hasBorder || this.shapeStyle.hasFill) && this.shapeStyle.thickness !== 0) {
      this.shapeCorner = CoordinatesXY.getEffectiveCoords(this.image, event);
      this.isChanging = true;
      this.setupProperties();
    }
  }

  onMouseRelease(event: MouseEvent): void {
    this.onMouseMove(event);
    this.isChanging = false;
    if (this.shapeIsEmpty) {
      this.manipulator.removeChild(this.image.nativeElement, this.subElement);
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isChanging) {
      const mousePosition = CoordinatesXY.getEffectiveCoords(this.image, event); // Save mouse position for KeyPress Event
      this.radius = Math.min(
        Math.abs(mousePosition.getX() - this.shapeCorner.getX()),
        Math.abs(mousePosition.getY() - this.shapeCorner.getY())
      ) / 2;
      const quadrant = mousePosition.getQuadrant(this.shapeCorner);

      const originY = (this.shapeCorner.getY() + ((quadrant === 1 || quadrant === 2) ? -this.radius : this.radius));
      const originX = (this.shapeCorner.getX() + ((quadrant === 1 || quadrant === 4) ? this.radius : -this.radius));
      this.shapeOrigin = new CoordinatesXY(originX, originY);

      this.updateShape();
    }
  }

  protected updateShape(): void {
    let points = '';
    let angle = (this.nSides % 2 ? -(Math.PI / 2) : -(Math.PI / 2) + (Math.PI / this.nSides));
    for (let i = 0; i < this.nSides; i++) {
      points += `${this.shapeOrigin.getX() + this.radius * Math.cos(angle)},${this.shapeOrigin.getY() + this.radius * Math.sin(angle)} `
      angle += (2 * Math.PI / this.nSides);
    }
    this.polygon.setAttribute(SVGProperties.points, points);
    this.shapeIsEmpty = (this.radius === 0);
  }

  protected setupProperties(): void {
    // Creating elements
    this.subElement = this.manipulator.createElement('g', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.subElement, SVGProperties.title, Tools.Polygon);
    this.polygon = this.manipulator.createElement(SVGProperties.polygon, 'http://www.w3.org/2000/svg');

    // Adding fill properties
    if (this.shapeStyle.hasFill) {
      this.manipulator.setAttribute(this.polygon, SVGProperties.fill, this.shapeStyle.fillColor.getHex());
      this.manipulator.setAttribute(this.polygon, SVGProperties.fillOpacity, this.shapeStyle.fillOpacity.toString());
    } else {
      this.manipulator.setAttribute(this.polygon, SVGProperties.fill, 'none');
    }

    // Adding border properties
    if (this.shapeStyle.hasBorder) {
      this.manipulator.setAttribute(this.polygon, SVGProperties.thickness, this.shapeStyle.thickness.toString());
      this.manipulator.setAttribute(this.polygon, SVGProperties.color, this.shapeStyle.borderColor.getHex());
      this.manipulator.setAttribute(this.polygon, SVGProperties.borderOpacity, this.shapeStyle.borderOpacity.toString());
    } else {
      this.manipulator.setAttribute(this.polygon, SVGProperties.thickness, 'none');
    }

    // Adding elements to DOM
    this.manipulator.appendChild(this.subElement, this.polygon);
    this.manipulator.appendChild(this.image.nativeElement, this.subElement);
  }
}
