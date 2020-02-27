import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { DrawableService } from '../drawable.service';
import { ColorSelectorService } from '../../../color-selector.service';
import { DrawStackService } from '../../../tools/draw-stack/draw-stack.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
//import { CoordinatesXY } from '../../../../classes/coordinates-x-y';
import { SVGProperties } from '../../../../classes/svg-properties';


@Injectable({
  providedIn: 'root'
})
export class ColorApplicatorService extends DrawableService {

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


  constructor() {
    super();
    this.frenchName = 'Applicateur De Couleur';
  }

  onClick(event: MouseEvent): void {
    let elementOnTop = event.target as SVGElement;
    const colorFill = this.colorSelectorService.primaryColor.getValue().getHex();
    const colorBorder = this.colorSelectorService.secondaryColor.getValue().getHex();
    const colorFillOpacity = this.colorSelectorService.primaryTransparency.getValue() as unknown as string;
    const colorBorderOpacity = this.colorSelectorService.secondaryTransparency.getValue() as unknown as string;

    if(elementOnTop !== undefined) {
      console.log(elementOnTop);
      console.log(elementOnTop.firstChild);
      console.log(elementOnTop.firstElementChild);
      const capturedSVG = elementOnTop ;
      const actualColor = capturedSVG.getAttribute(SVGProperties.fill);
      if (event.button === 0 && actualColor !== 'none'){
          this.manipulator.setAttribute(elementOnTop, SVGProperties.fill, colorFill);
        this.manipulator.setAttribute(elementOnTop, SVGProperties.fillOpacity, colorFillOpacity);

      } else if (capturedSVG.tagName === 'polyline'){
        this.manipulator.setAttribute(elementOnTop, SVGProperties.color, colorFill);
        this.manipulator.setAttribute(elementOnTop, SVGProperties.colorOpacity, colorFillOpacity);
      }

      else if (event.button === 0 && capturedSVG.tagName === 'path' ) {
        this.manipulator.setAttribute(elementOnTop, SVGProperties.color, colorFill);
        this.manipulator.setAttribute(elementOnTop, SVGProperties.fillOpacity, colorFillOpacity);
      }
        else if (event.button === 2) {
          if (capturedSVG.tagName !== 'path' )
            this.manipulator.setAttribute(elementOnTop, SVGProperties.color, colorBorder);
            this.manipulator.setAttribute(elementOnTop, SVGProperties.colorOpacity, colorBorderOpacity);
        }
    }

  }
}
