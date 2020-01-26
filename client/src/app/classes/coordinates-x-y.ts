export class CoordinatesXY {
  private x: number;
  private y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getX(): number  { return this.x; }
  getY(): number  { return this.y; }

  setX(x: number): void { this.x = x; }
  setY(y: number): void { this.y = y; }

  getClosestPoint(pointerX: number, pointerY: number): CoordinatesXY {
    const distanceX = pointerX - this.x;
    const distanceY = pointerY - this.y;

    const angle = Math.atan(distanceX/distanceY);

    switch(this.findQuadrant(distanceX, distanceY))
    {
      case 1: {
        if (angle < (Math.PI / 4) / 2) {
          return new CoordinatesXY(pointerX, this.y);
        } else {
          if(angle < (Math.PI / 2) / 2) {
            return new CoordinatesXY(pointerY, pointerY);
          }
          return new CoordinatesXY(this.x, pointerY);
        }
      }
      case 2: {
        if (angle < ( (3 * Math.PI) / 4) / 2) {
          return new CoordinatesXY(this.x, pointerY);
        } else {
          if(angle < Math.PI / 2) {
            return new CoordinatesXY(pointerY, pointerY);
          }
          return new CoordinatesXY(pointerX, this.y);
        }
      }
      case 3: {
        if (angle < ( (5 * Math.PI) / 4) / 2) {
          return new CoordinatesXY(pointerX, this.y);
        } else {
          if(angle < ( (3 * Math.PI) / 2) / 2) {
            return new CoordinatesXY(pointerY, pointerY);
          }
          return new CoordinatesXY(this.x, pointerY);
        }
      }

      default: {
        if (angle < ( (7 * Math.PI) / 4) / 2) {
          return new CoordinatesXY(this.x, pointerY);
        } else {
          if(angle < (2 * Math.PI) / 2) {
            return new CoordinatesXY(pointerY, pointerY);
          }
          return new CoordinatesXY(pointerX, this.x);
        }
      }
    }
  }



  private findQuadrant(distanceX: number, distanceY: number): number {
    if (distanceX >= 0 && distanceY >= 0) {
      return 1;
    } 
    if (distanceX >= 0 && distanceY < 0) {
      return 4;
    }
    if (distanceX < 0 && distanceY < 0) {
      return 3;
    }
    return 2;
  }
}
