import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { DrawableService } from '../drawable.service';
import { ColorSelectorService } from '../../../color-selector.service';
import { DrawStackService } from '../../../tools/draw-stack/draw-stack.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { CoordinatesXY } from '../../../../classes/coordinates-x-y';

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
    if(elementOnTop !== undefined) {

        this.manipulator.setAttribute(this.selectedElement.target.firstChild, SVGProperties.color, this.oldBorder);
        this.selectedElement = elementOnTop;

      const color = this.selectedElement.target.getAttribute(SVGProperties.color); // NO I HAVE TO THE COLOR OF .firstChild
      if(color !== null) {
        this.oldBorder = color;
      }
      this.manipulator.setAttribute(this.selectedElement.target.firstChild, SVGProperties.color, CONSTANTS.ERASER_OUTLINE);
    }

  }
}
