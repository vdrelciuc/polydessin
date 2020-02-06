export class CoordinatesXY {

  constructor(x: number, y: number) {
    this.setX(x);
    this.setY(y);
  }
  private x: number;
  private y: number;

  getX(): number  { return this.x; }
  getY(): number  { return this.y; }

  setX(x: number): void {
    if (x >= 0) {
      this.x = x;
    }
  }

  setY(y: number): void {
    if (y >= 0) {
      this.y = y;
    }
  }

  getClosestPoint(pointerX: number, pointerY: number): CoordinatesXY {
    const distanceX = pointerX - this.x;
    const distanceY = pointerY - this.y;
    const foundQuadrant = CoordinatesXY.findQuadrantFromDelta(distanceX, distanceY);
    if (foundQuadrant === 1  || foundQuadrant === 3) {
      const angle = (Math.atan(distanceY / distanceX) * 180) / Math.PI; console.log(angle);
      return this.getShiftedPoint(angle, pointerX, pointerY, this.y + this.findYDifferenceForBisectrix(pointerX));
    } else {
      const angle = -(Math.atan(distanceY / distanceX) * 180) / Math.PI; console.log(angle);
      return this.getShiftedPoint(angle, pointerX, pointerY, this.y - this.findYDifferenceForBisectrix(pointerX));
    }
  }

  private getShiftedPoint(angle: number, pointerX: number, pointerY: number, bisectrixY: number): CoordinatesXY {
    if (angle < 45 / 2) {
      return new CoordinatesXY(pointerX, this.y);
    } else {
      if (angle <  3 * (90 / 4)) {
        return new CoordinatesXY(pointerX, bisectrixY);
      }
      return new CoordinatesXY(this.x, pointerY);
    }
  }

  private findYDifferenceForBisectrix(pointerX: number): number {
    return pointerX - this.x;
  }


  private static findQuadrantFromDelta(distanceX: number, distanceY: number): 1 | 2 | 3 | 4 {
    if (distanceX >= 0 && distanceY >= 0) {
      return 1;
    }
    if (distanceX < 0 && distanceY > 0) {
      return 2;
    }
    if (distanceX <= 0 && distanceY <= 0) {
      return 3;
    }
    return 4;
  }
}
