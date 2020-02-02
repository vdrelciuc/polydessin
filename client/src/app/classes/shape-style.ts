import { Color } from './color';

export interface ShapeStyle {
  thickness: number;
  borderColor: Color;
  fillColor: Color;
  opacity: string;

  hasBorder: boolean;
  hasFill: boolean;

  nameDisplayDefault: string;
  nameDisplayOnShift: string;
}
