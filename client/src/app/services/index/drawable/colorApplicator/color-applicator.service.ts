import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { DrawableService } from '../drawable.service';
import { ColorSelectorService } from '../../../color-selector.service';
import { DrawStackService } from '../../../tools/draw-stack/draw-stack.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { CoordinatesXY } from '../../../../classes/coordinates-x-y';
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
    let elementOnTop = this.drawStack.findTopElementAt(new CoordinatesXY(
      event.clientX,
      event.clientY));
    const colorFill = this.colorSelectorService.primaryColor.getValue().getHex();
    const colorBorder = this.colorSelectorService.secondaryColor.getValue().getHex();

    if(elementOnTop !== undefined) {
      console.log(elementOnTop.target);
      console.log(elementOnTop.target.firstChild);
      console.log(elementOnTop.target.firstElementChild);
      const capturedSVG = elementOnTop.target.firstChild as SVGElement;
      const actualColor = capturedSVG.getAttribute(SVGProperties.fill);
      //const actualBorder = capturedSVG.getAttribute(SVGProperties.color);
      const junction = capturedSVG.getAttribute(SVGProperties.joint);
      if (event.button === 0 && actualColor !== 'none'){
          this.manipulator.setAttribute(elementOnTop.target.firstChild, SVGProperties.fill, colorFill);
        } else if (event.button ===0 && junction === "round" ) {
        this.manipulator.setAttribute(elementOnTop.target.firstChild, SVGProperties.color, colorFill);
      }
        else if (event.button === 2) {
          if (actualColor !== 'none' ){
            this.manipulator.setAttribute(elementOnTop.target.firstChild, SVGProperties.color, colorBorder);
          }
        }
    }

  }
}
