import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import * as CONSTANTS from 'src/app/classes/constants';
import { Color } from '../../classes/color';
import { CoordinatesXY } from '../../classes/coordinates-x-y';
import { CursorProperties } from '../../classes/cursor-properties';
import { ColorType } from '../../enums/color-types';
import { ColorSelectorService } from '../color-selector/color-selector.service';
import { DrawableService } from '../drawable/drawable.service';
import { DrawStackService } from '../draw-stack/draw-stack.service';

@Injectable({
  providedIn: 'root',
})
export class PipetteService extends DrawableService {

  hiddenCanvas: HTMLCanvasElement;

  constructor() {
    super();
    this.frenchName = 'Pipette';
  }

  onSelect(): void {
    this.getColorAtPosition(new CoordinatesXY(1, 1));
    this.manipulator.setAttribute(this.image.nativeElement, CursorProperties.cursor, CursorProperties.crosshair);
  }

  endTool(): void {
    this.manipulator.setAttribute(this.image.nativeElement, CursorProperties.cursor, CursorProperties.default);
  }

  setupCanvas(hiddenCanvas: HTMLCanvasElement): void {
    this.hiddenCanvas = hiddenCanvas;
  }

  initialize(manipulator: Renderer2,
             image: ElementRef<SVGElement>,
             colorSelectorService: ColorSelectorService,
             drawStack: DrawStackService): void {
    this.initializeProperties();
    this.assignParams(manipulator, image, colorSelectorService, drawStack);
  }

  initializeProperties(): void { /* No properties to initialize */ }

  // Adapted from https://jsfiddle.net/Wijmo5/h2L3gw88/
  private getColorAtPosition(coordinates: CoordinatesXY): Color | null {
    const ctx = this.hiddenCanvas.getContext('2d');
    if (this.hiddenCanvas !== null && ctx !== null) {
      const xml = new XMLSerializer().serializeToString(this.image.nativeElement);
      const imageAfterDeserialization = new Image();
      const svg64 = btoa(xml);
      const b64Start = 'data:image/svg+xml;base64,';
      const image64 = b64Start + svg64;
      imageAfterDeserialization.src = image64;

      imageAfterDeserialization.onload = () => {
        if (ctx !== null) {
          ctx.canvas.width = imageAfterDeserialization.width;
          ctx.canvas.height = imageAfterDeserialization.height;
          ctx.drawImage(imageAfterDeserialization, 0, 0);
        }
      };

      const imageData = ctx.getImageData(coordinates.getX(), coordinates.getY(), 1, 1).data;
      const hexValue = '#'
        + this.correctDigits(imageData[0].toString(CONSTANTS.HEX_BASE))
        + this.correctDigits(imageData[1].toString(CONSTANTS.HEX_BASE))
        + this.correctDigits(imageData[2].toString(CONSTANTS.HEX_BASE));

      return new Color(hexValue);
    }
    return null;
  }

  private correctDigits(n: string): string {
    return n.length > 1 ? n : '0' + n;
  }

  onClick(event: MouseEvent): void {
    const position = CoordinatesXY.getEffectiveCoords(this.image, event);
    const newColor = this.getColorAtPosition(position);
    if (newColor != null && (event.button === CONSTANTS.LEFT_CLICK || event.button === CONSTANTS.RIGHT_CLICK)) {
      if (event.button === CONSTANTS.LEFT_CLICK) {
        this.colorSelectorService.colorToChange = ColorType.Primary;
      } else {
        this.colorSelectorService.colorToChange = ColorType.Secondary;
      }
      this.colorSelectorService.updateColor(newColor);
    }
  }
}
