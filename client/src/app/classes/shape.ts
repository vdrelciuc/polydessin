import { ShapeStyle } from './shape-style';

export class Shape {
  shapeProperties: ShapeStyle;
  private originX: number;
  private originY: number;

  constructor() {
      this.originX = 0;
      this.originY = 0;
  }

  changeOrigin(newX: number, newY: number) {
    if (newX >= 0 && newY >= 0) {
      this.originX = newX;
      this.originY = newY;
    }
  }

  getOriginX(): number { return this.originX; }

  getOriginY(): number { return this.originY; }

}
