import { MatSliderChange } from '@angular/material';

export class ThicknessValidator {

  constructor(
    private event: MatSliderChange,
    private minimum: number,
    private maximum: number) {}

  isValid(): boolean {
    const thickness = this.event.value;
    if (thickness !== null
      && thickness <= this.maximum
      && thickness >= this.minimum) {
        return true;
    }
    return false;
  }
}
