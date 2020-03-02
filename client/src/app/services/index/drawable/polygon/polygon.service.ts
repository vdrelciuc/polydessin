import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { Color } from 'src/app/classes/color';
import * as CONSTANT from 'src/app/classes/constants';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { ShapeStyle } from 'src/app/classes/shape-style';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
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
  protected isChanging: boolean;

  protected subElement: SVGGElement;
  protected polygon: SVGPolygonElement;
  protected perimeter: SVGPolygonElement;
  protected perimeterAlternative: SVGPolygonElement;
  protected ratioYX: number;
  protected ID: number;

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

  initialize(manipulator: Renderer2, image: ElementRef, colorSelectorService: ColorSelectorService, drawStack: DrawStackService): void {
    this.assignParams(manipulator, image, colorSelectorService, drawStack);
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
      this.ID = this.drawStack.getNextID();
      this.isChanging = true;
      this.startDraw();
      this.shapeCorner = CoordinatesXY.getEffectiveCoords(this.image, event);
      this.updateProperties();
    }
  }

  onMouseRelease(event: MouseEvent): void {
    if (this.isChanging) {
      this.onMouseMove(event);
      this.isChanging = false;
      if (this.shapeIsEmpty) {
        this.manipulator.removeChild(this.image.nativeElement, this.subElement);
      } else {
        this.manipulator.removeChild(this.subElement, this.perimeter);
        this.manipulator.removeChild(this.subElement, this.perimeterAlternative);
        this.drawStack.addElementWithInfos({
          target: this.subElement,
          id: this.ID
        });
      }
    }
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

      if (height > width * this.ratioYX) {
        height = width * this.ratioYX;
      } else {
        width = height / this.ratioYX;
      }

      this.radius = height / (this.nSides % 2 ? 1 + Math.cos(this.theta / 2) : 2);
      let originX: number;
      let originY: number;
      originX = this.shapeCorner.getX() + ((quadrant === 1 || quadrant === 4) ? width / 2 : -width / 2);

      if (quadrant === 1 || quadrant === 2) {
        originY = this.shapeCorner.getY() - ((this.nSides % 2 === 0) ? height / 2 : height - this.radius);
      } else {
        originY = this.shapeCorner.getY() + ((this.nSides % 2 === 0) ? height / 2 : this.radius);
      }
      this.shapeOrigin = new CoordinatesXY(originX, originY);

      this.updateDraw();
    }
  }

  calculateRatioYX(): void {
    let angle = (Math.PI / 2);
    while (true) {
      if (Math.cos(angle) < Math.cos(angle - this.theta)) {
        angle -= this.theta;
      } else {
        break;
      }
    }

    const width = 2 * Math.cos(angle);
    const height = ((this.nSides % 2) ? 1 + Math.cos(this.theta / 2) : 2);

    this.ratioYX = height / width;
  }

  protected updateDraw(): void {
    let points = '';

    let angle = -Math.PI / 2;
    for (let i = 0; i < this.nSides; i++) {
      points += `${this.shapeOrigin.getX() + this.radius * Math.cos(angle)},${this.shapeOrigin.getY() + this.radius * Math.sin(angle)} `;
      angle += this.theta;
    }
    let perimeterPoints = `${this.shapeCorner.getX()},${this.shapeCorner.getY()} `;
    perimeterPoints += `${this.shapeCorner.getX()},${this.mousePointer.getY()} `;
    perimeterPoints += `${this.mousePointer.getX()},${this.mousePointer.getY()} `;
    perimeterPoints += `${this.mousePointer.getX()},${this.shapeCorner.getY()}`;
    this.polygon.setAttribute(SVGProperties.points, points);
    this.perimeter.setAttribute(SVGProperties.points, perimeterPoints);
    this.perimeterAlternative.setAttribute(SVGProperties.points, perimeterPoints);
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
      this.manipulator.setAttribute(this.polygon, SVGProperties.thickness, (this.shapeStyle.thickness * 2).toString());
      this.manipulator.setAttribute(this.polygon, SVGProperties.borderOpacity, this.shapeStyle.borderOpacity.toString());
    } else {
      this.manipulator.setAttribute(this.polygon, SVGProperties.color, 'none');
    }
    const background = this.colorSelectorService.backgroundColor.getValue();
    this.manipulator.setAttribute(this.perimeter, SVGProperties.color, background.getInvertedColor(true).getHex());
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.color, background.getHex());
  }

  startDraw(): void {
    // Creating elements
    this.subElement = this.manipulator.createElement('g', 'http://www.w3.org/2000/svg');
    this.polygon = this.manipulator.createElement(SVGProperties.polygon, 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.subElement, SVGProperties.title, this.ID.toString());
    this.manipulator.setAttribute(this.polygon, 'id', `polygon${this.ID}`);

    // Creating perimeter
    this.perimeter = this.manipulator.createElement(SVGProperties.polygon, 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.perimeter, SVGProperties.thickness, '1');
    this.manipulator.setAttribute(this.perimeter, SVGProperties.fill, 'none');
    this.manipulator.setAttribute(this.perimeter, SVGProperties.dashedBorder, '4,4');

    this.perimeterAlternative = this.manipulator.createElement(SVGProperties.polygon, 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.thickness, '1');
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.fill, 'none');
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.dashedBorder, '4,4');
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.dashedBorderOffset, '4');

    // setting clip-path
    this.manipulator.setAttribute(this.polygon, 'clip-path', `url(#clip${this.ID})`);
    const clip = this.manipulator.createElement('clipPath', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(clip, 'id', `clip${this.ID}`);
    const use = this.manipulator.createElement('use', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(use, 'href', `#polygon${this.ID}`);

    // Adding elements to DOM
    this.manipulator.appendChild(this.subElement, this.polygon);
    this.manipulator.appendChild(this.image.nativeElement, this.subElement);
    this.manipulator.appendChild(this.subElement, this.perimeter);
    this.manipulator.appendChild(this.subElement, this.perimeterAlternative);
    this.manipulator.appendChild(this.subElement, clip);
    this.manipulator.appendChild(clip, use);
  }
  endTool(): void {
    if (this.isChanging) {
      this.manipulator.removeChild(this.image.nativeElement, this.subElement);
      this.isChanging = false;
    }
  }
}
