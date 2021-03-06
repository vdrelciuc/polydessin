import { Injectable, } from '@angular/core';
import { Color } from 'src/app/classes/color';
import * as CONSTANT from 'src/app/classes/constants';
import { SVGProperties } from 'src/app/enums/svg-html-properties';
import { Tools } from 'src/app/enums/tools';
import { ShapeService } from '../shapes/shape.service';

@Injectable({
  providedIn: 'root'
})
export class RectangleService extends ShapeService {

  constructor() {
    super();
    this.frenchName = 'Rectangle';
    this.shapeStyle = {
      thickness: CONSTANT.THICKNESS_DEFAULT,
      borderColor: new Color(),
      fillColor: new Color(),
      borderOpacity: CONSTANT.OPACITY_DEFAULT,
      fillOpacity: CONSTANT.OPACITY_DEFAULT,
      hasBorder: true,
      hasFill: true,
      nameDisplayDefault: '[Rectangle]',
      nameDisplayOnShift: '[Carré]'
    };
    this.svgHtmlTag = SVGProperties.rectangle;
    this.svgTitle = Tools.Rectangle;
  }

  protected setDimensionsAttributes(width: number, height: number): void {
    this.manipulator.setAttribute(this.shape, SVGProperties.width, width.toString());
    this.manipulator.setAttribute(this.shape, SVGProperties.height, height.toString());
  }

  // Width and height are not needed for the SVG rectangle element, but is needed for other shapes

  protected setShapeOriginFromRightQuadrants(width: number): void {
    width = width; // TODO : to be used in Sprint 3
    this.manipulator.setAttribute(this.shape, SVGProperties.x, this.shapeOrigin.getX().toString());
  }

  protected setShapeOriginFromLeftQuadrants(width: number): void {
    width = width; // TODO : to be used in Sprint 3
    this.manipulator.setAttribute(this.shape, SVGProperties.x, this.mousePosition.getX().toString());
  }

  protected setShapeOriginFromLowerQuadrants(height: number): void {
    height = height; // TODO : to be used in Sprint 3
    this.manipulator.setAttribute(this.shape, SVGProperties.y, this.shapeOrigin.getY().toString());
  }

  protected setShapeOriginFromUpperQuadrants(height: number): void {
    height = height; // TODO : to be used in Sprint 3
    this.manipulator.setAttribute(this.shape, SVGProperties.y, this.mousePosition.getY().toString());
  }
}
