import { Injectable } from '@angular/core';
import { Color } from 'src/app/classes/color';
import * as CONSTANT from 'src/app/classes/constants';
import { SVGProperties } from 'src/app/enums/svg-html-properties';
import { Tools } from 'src/app/enums/tools';
import { ShapeService } from '../shapes/shape.service';

@Injectable({
  providedIn: 'root'
})
export class EllipseService extends ShapeService {

  constructor() {
    super();
    this.frenchName = 'Ellipse';
    this.shapeStyle = {
      thickness: CONSTANT.THICKNESS_DEFAULT,
      borderColor: new Color(),
      fillColor: new Color(),
      borderOpacity: CONSTANT.OPACITY_DEFAULT,
      fillOpacity: CONSTANT.OPACITY_DEFAULT,
      hasBorder: true,
      hasFill: true,
      nameDisplayDefault: '[Ellipse]',
      nameDisplayOnShift: '[Cercle]'
    };
    this.svgHtmlTag = SVGProperties.ellipse;
    this.svgTitle = Tools.Ellipse;
  }

  protected setDimensionsAttributes(width: number, height: number): void {

    this.manipulator.setAttribute(this.shape, SVGProperties.radiusX, (width / 2).toString());
    this.manipulator.setAttribute(this.shape, SVGProperties.radiusY, (height / 2).toString());
  }

  // Width and height are not needed for the SVG rectangle element, but is needed for other shapes

  protected setShapeOriginFromRightQuadrants(width: number): void {
    this.manipulator.setAttribute(this.shape, SVGProperties.centerX, (this.shapeOrigin.getX() + width / 2).toString());
  }

  protected setShapeOriginFromLeftQuadrants(width: number): void {
    this.manipulator.setAttribute(this.shape, SVGProperties.centerX, (this.mousePosition.getX() + width / 2).toString());
  }

  protected setShapeOriginFromLowerQuadrants(height: number): void {
    this.manipulator.setAttribute(this.shape, SVGProperties.centerY, (this.shapeOrigin.getY() + height / 2).toString());
  }

  protected setShapeOriginFromUpperQuadrants(height: number): void {
    this.manipulator.setAttribute(this.shape, SVGProperties.centerY, (this.mousePosition.getY() + height / 2).toString());
  }
}
