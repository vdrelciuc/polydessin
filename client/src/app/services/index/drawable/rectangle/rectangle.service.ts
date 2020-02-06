import { Injectable, } from '@angular/core';
import { Color } from 'src/app/classes/color';
import * as CONSTANT from 'src/app/classes/constants';
import { ShapeService } from '../shapes/shape.service';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { Tools } from 'src/app/enums/tools';


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
      opacity: CONSTANT.OPACITY_DEFAULT,
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

  protected setShapeOriginFromRightQuadrants(_width: number): void {
    this.manipulator.setAttribute(this.shape, SVGProperties.x, this.shapeOrigin.x.toString());
  }

  protected setShapeOriginFromLeftQuadrants(_width: number): void {
    this.manipulator.setAttribute(this.shape, SVGProperties.x, this.mousePosition.x.toString());
  }

  protected setShapeOriginFromLowerQuadrants(_height: number): void {
    this.manipulator.setAttribute(this.shape, SVGProperties.y, this.shapeOrigin.y.toString());
  }

  protected setShapeOriginFromUpperQuadrants(_height: number): void {
    this.manipulator.setAttribute(this.shape, SVGProperties.y, this.mousePosition.y.toString());
  }
}
