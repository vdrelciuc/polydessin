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
  protected mousePointer: CoordinatesXY;
  protected radius: number;
  protected theta: number;
  protected needRotate: boolean;
  protected isChanging: boolean;

  protected subElement: SVGGElement;
  protected polygon: SVGPolygonElement;
  protected perimeter: SVGPolygonElement;
  protected ratioYX: number;

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
      this.isChanging = true;
      this.startDraw();
      this.shapeCorner = CoordinatesXY.getEffectiveCoords(this.image, event);
      this.updateProperties();
    }
  }

  onMouseRelease(event: MouseEvent): void {
    this.onMouseMove(event);
    this.isChanging = false;
    if (this.shapeIsEmpty) {
      this.manipulator.removeChild(this.image.nativeElement, this.subElement);
    }
    this.manipulator.removeChild(this.image.nativeElement, this.perimeter);
  }

  onMouseInCanvas(event: MouseEvent): void {
    if (this.isChanging) {
      this.updateProperties();
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isChanging) {
      this.mousePointer = CoordinatesXY.getEffectiveCoords(this.image, event);
      let height = Math.abs(this.mousePointer.getY() - this.shapeCorner.getY());
      let width = Math.abs(this.mousePointer.getX() - this.shapeCorner.getX());
      const quadrant = this.mousePointer.getQuadrant(this.shapeCorner);

      this.needRotate = height > width;

      if (height > (this.needRotate ? width / this.ratioYX : width * this.ratioYX)) {
        height = (this.needRotate ? width / this.ratioYX : width * this.ratioYX);
      } else {
        width = (this.needRotate ? height * this.ratioYX : height / this.ratioYX);
      }

      this.radius = (this.needRotate ? width : height) / (this.nSides % 2 ? 1 + Math.cos(this.theta / 2) : 2 * Math.cos(this.theta / 2));
      let originX: number;
      let originY: number;
      if (quadrant === 1 || quadrant === 4) {
        originX = this.shapeCorner.getX() + (this.needRotate && this.nSides % 2 ? this.radius : width / 2);
      } else {
        originX = this.shapeCorner.getX() - (this.needRotate && this.nSides % 2 ? width - this.radius : width / 2);
      }
      if (quadrant === 1 || quadrant === 2) {
        originY = this.shapeCorner.getY() - (this.needRotate || (this.nSides % 2 === 0) ? height / 2 : height - this.radius);
      } else {
        originY = this.shapeCorner.getY() + (this.needRotate || (this.nSides % 2 === 0) ? height / 2 : this.radius);
      }
      this.shapeOrigin = new CoordinatesXY(originX, originY);

      this.updateDraw();
    }
  }

  calculateRatioYX(): void {
    let angle = ((Math.PI / 2) - (this.theta / 2));
    while (true) {
      if (Math.cos(angle) < Math.cos(angle - this.theta)) {
        angle -= this.theta;
      } else {
        break;
      }
    }

    const width = 2 * Math.cos(angle);
    const height = ((this.nSides % 2) ? 1 + Math.cos(this.theta / 2) : 2 * Math.cos(this.theta / 2));

    this.ratioYX = height / width;
  }

  protected updateDraw(): void {
    let points = '';
    const thicknessRadius = this.shapeStyle.thickness / 2 / Math.sin((this.nSides - 2) * Math.PI / this.nSides / 2);
    if (this.radius > thicknessRadius) {
      this.radius -= thicknessRadius;
      this.manipulator.setAttribute(this.polygon, SVGProperties.thickness, (this.shapeStyle.thickness).toString());
    } else {
      const newThickness = this.radius * Math.sin((this.nSides - 2) * Math.PI / this.nSides / 2);
      this.manipulator.setAttribute(this.polygon, SVGProperties.thickness, (newThickness).toString());
      this.radius /= 2;
    }

    let angle = this.theta / 2 + (this.needRotate ? 0 : (Math.PI / 2));
    for (let i = 0; i < this.nSides; i++) {
      points += `${this.shapeOrigin.getX() + this.radius * Math.cos(angle)},${this.shapeOrigin.getY() + this.radius * Math.sin(angle)} `
      angle += this.theta;
    }
    let perimeterPoints = `${this.shapeCorner.getX()},${this.shapeCorner.getY()} `;
    perimeterPoints += `${this.shapeCorner.getX()},${this.mousePointer.getY()} `;
    perimeterPoints += `${this.mousePointer.getX()},${this.mousePointer.getY()} `;
    perimeterPoints += `${this.mousePointer.getX()},${this.shapeCorner.getY()}`;
    this.polygon.setAttribute(SVGProperties.points, points);
    this.perimeter.setAttribute(SVGProperties.points, perimeterPoints);
    this.shapeIsEmpty = (this.radius === 0);
  }

  protected updateProperties(): void {
    this.theta = (2 * Math.PI / this.nSides);
    this.calculateRatioYX();

    // Adding fill properties
    if (this.shapeStyle.hasFill) {
      this.manipulator.setAttribute(this.polygon, SVGProperties.fill, this.shapeStyle.fillColor.getHex());
      this.manipulator.setAttribute(this.polygon, SVGProperties.fillOpacity, this.shapeStyle.fillOpacity.toString());
    } else {
      this.manipulator.setAttribute(this.polygon, SVGProperties.fill, 'none');
    }

    // Adding border properties
    if (this.shapeStyle.hasBorder) {
      this.manipulator.setAttribute(this.polygon, SVGProperties.color, this.shapeStyle.borderColor.getHex());
      this.manipulator.setAttribute(this.polygon, SVGProperties.borderOpacity, this.shapeStyle.borderOpacity.toString());
    } else {
      this.manipulator.setAttribute(this.polygon, SVGProperties.thickness, 'none');
    }

    this.manipulator.setAttribute(this.perimeter, SVGProperties.color, this.shapeStyle.fillColor.getHex());
  }

  startDraw(): void {
    // Creating elements
    this.subElement = this.manipulator.createElement('g', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.subElement, SVGProperties.title, Tools.Polygon);
    this.polygon = this.manipulator.createElement(SVGProperties.polygon, 'http://www.w3.org/2000/svg');

    // Creating perimeter
    this.perimeter = this.manipulator.createElement(SVGProperties.polygon, 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.perimeter, SVGProperties.thickness, '1');
    this.manipulator.setAttribute(this.perimeter, SVGProperties.fill, 'none');
    this.manipulator.setAttribute(this.perimeter, SVGProperties.borderDash, '5,5');
    // Adding elements to DOM
    this.manipulator.appendChild(this.subElement, this.polygon);
    this.manipulator.appendChild(this.image.nativeElement, this.subElement);
    this.manipulator.appendChild(this.image.nativeElement, this.perimeter);
  }
  cancelDraw(): void {
    if (this.isChanging) {
      this.manipulator.removeChild(this.image.nativeElement, this.subElement);
      this.manipulator.removeChild(this.image.nativeElement, this.perimeter);
      this.isChanging = false;
    }
  }
}
