export class CoordinatesXY {
  private x: number;
  private y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get X(): number  { return this.x; }
  get Y(): number  { return this.y; }

  setX(x: number): void { this.x = x; }
  setY(y: number): void { this.y = y; }
}
