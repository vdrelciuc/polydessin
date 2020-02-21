import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import * as CONSTANTS from 'src/app/classes/constants';
import { Color } from '../classes/color';
import { CoordinatesXY } from '../classes/coordinates-x-y';
import { ColorType } from '../enums/color-types';
//import { SVGProperties } from '../classes/svg-properties';
import { ColorSelectorService } from './color-selector.service';
import { DrawableService } from './index/drawable/drawable.service';
import { DrawablePropertiesService } from './index/drawable/properties/drawable-properties.service';
import { DrawStackService } from './tools/draw-stack/draw-stack.service';

@Injectable({
  providedIn: 'root',
})
export class PipetteService extends DrawableService {
  readonly LEFT_CLICK = 0;
  readonly WHEEL_CLICK = 1;
  readonly RIGHT_CLICK = 2;

  hiddenCanvas: ElementRef;

  constructor() {
    super();
  }

  setupCanvas(hiddenCanvas: ElementRef) {
    this.hiddenCanvas = hiddenCanvas;
  }

  initialize(manipulator: Renderer2,
             image: ElementRef<SVGElement>,
             colorSelectorService: ColorSelectorService,
             drawStack: DrawStackService): void {
    this.initializeProperties();
    this.assignParams(manipulator, image, colorSelectorService, drawStack);
  }

  initializeProperties(): void {}

  protected assignParams(
    manipulator: Renderer2,
    image: ElementRef<SVGElement>,
    colorSelectorService: ColorSelectorService,
    drawStack: DrawStackService): void {
    this.manipulator = manipulator;
    this.image = image;
    this.colorSelectorService = colorSelectorService;
    this.drawStack = drawStack;
    this.attributes = new DrawablePropertiesService();
  }

  // Adapted from https://jsfiddle.net/Wijmo5/h2L3gw88/
  private getColorAtPosition(coordinates: CoordinatesXY): Color {
    let ctx: CanvasRenderingContext2D;
    ctx = this.hiddenCanvas.nativeElement.getContext('2d');

    const xml = new XMLSerializer().serializeToString(this.image.nativeElement);
    const svg64 = btoa(xml);
    const b64Start = 'data:image/svg+xml;base64,';
    const image64 = b64Start + svg64;

    const width = this.image.nativeElement.clientWidth;
    const height = this.image.nativeElement.clientHeight;

    let img = new Image();
    img.src = image64;

    console.log(img.src);
    console.log(coordinates.getX() + "  |  " + coordinates.getY());
    console.log("height " + height);

    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(coordinates.getX(), coordinates.getY(), width, height).data;
    console.log(imageData);
    const hexValue = '#'
    + this.correctDigits(imageData[0].toString(CONSTANTS.HEX_BASE))
    + this.correctDigits(imageData[1].toString(CONSTANTS.HEX_BASE))
    + this.correctDigits(imageData[2].toString(CONSTANTS.HEX_BASE));

    var clearImg = ctx.createImageData(width, height);
    for (var i = clearImg.data.length; --i >= 0; ) {
      clearImg.data[i] = 0;
    }
    ctx.putImageData(clearImg, 0, 0);

    return new Color(hexValue);
  }

  private correctDigits(n: string): string {
    return n.length > 1 ? n : '0' + n;
  }

  onClick(event: MouseEvent): void {
    const position = CoordinatesXY.getEffectiveCoords(this.image, event);
    const newColor = this.getColorAtPosition(position);
    if (newColor != null) {
      if (event.button === this.LEFT_CLICK) {
        this.colorSelectorService.colorToChange = ColorType.Primary;
      } else if (event.button === this.RIGHT_CLICK) {
        this.colorSelectorService.colorToChange = ColorType.Secondary;
      }
      this.colorSelectorService.updateColor(newColor);
    }
  }

  /*
  onClick(event: MouseEvent): void {
    const position = new CoordinatesXY(event.clientX, event.clientY);
    const svgElement = this.drawStack.findTopElementAt(position);
    if (svgElement !== undefined) {
      const capturedSVG = svgElement.target.firstChild as SVGElement;
      const targetedColor = capturedSVG.getAttribute(SVGProperties.fill);
      if (targetedColor !== null) {
         if (event.button === this.LEFT_CLICK) {
           this.colorSelectorService.colorToChange = ColorType.Primary;
         } else if (event.button === this.RIGHT_CLICK) {
           this.colorSelectorService.colorToChange = ColorType.Secondary;
         }
         this.colorSelectorService.updateColor(new Color(targetedColor));
      }
    }
  }*/
}
