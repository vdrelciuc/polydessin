export class ShapeProperties {
  fillColor: string;
  thickness: number;
  visible: boolean;

  constructor() {
    this.fillColor = '#e7e7e7';
  }

  changeColor(newColor: string): void {
    this.fillColor = newColor;
  }

  changeThickness(newThickness: number): void {
    this.thickness = newThickness;
  }
}
