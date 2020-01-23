import { ShapeProperties } from './shape-properties';

export class Shape {
  shapeProperties: ShapeProperties;
  private originX: number;
  private originY: number;

  constructor() {
      this.shapeProperties = new ShapeProperties();
      this.originX = this.originY = 0;
  }

  changeOrigin(newX: number, newY: number) {
    this.originX = newX;
    this.originY = newY;
  }

  getOriginX(): number { return this.originX; }

  getOriginY(): number { return this.originY; }

}
