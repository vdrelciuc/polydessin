import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { SVGProperties } from '../../../classes/svg-html-properties';
import { ColorSelectorService } from '../../color-selector/color-selector.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { DrawableService } from '../drawable.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';

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

  initializeProperties(): void { /* No properties to initialize for this tool */}

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
    this.frenchName = 'Applicateur de couleur';
  }

  onClick(event: MouseEvent): void {
    const clickedElement = event.target as SVGElement;

    if (clickedElement !== undefined && (event.button === 0 || event.button === 2)) {
      event.button === 0 ? this.onLeftClick(clickedElement) : this.onRightClick(clickedElement);

      if (clickedElement.tagName !== 'svg') {
        this.drawStack.addSVG(this.image.nativeElement.cloneNode(true) as SVGElement);
      }
    }
  }

  private onLeftClick(clickedElement: SVGElement): void {
    const hasFill = clickedElement.getAttribute(SVGProperties.fill) !== 'none';
    const newColor = this.colorSelectorService.primaryColor.getValue().getHex();
    const newOpacity = this.colorSelectorService.primaryTransparency.getValue().toString();

    if ((clickedElement.tagName === SVGProperties.rectangle || clickedElement.tagName === SVGProperties.ellipse || clickedElement.tagName === SVGProperties.polygon) && hasFill) {
      this.shapeChange(clickedElement, newColor, newOpacity, true);
    } else if (clickedElement.tagName === SVGProperties.path) {
      this.pathChange(clickedElement, newColor, newOpacity);
    } else if ((clickedElement.tagName === SVGProperties.polyLine || clickedElement.tagName === SVGProperties.circle) && clickedElement.parentNode !== null) {
      const children = clickedElement.parentNode.childNodes;

      if ((children[0] as SVGElement).tagName === SVGProperties.polyLine) {
        this.pathChange(children[0] as SVGElement, newColor, newOpacity);
      } else {
        this.shapeChange(children[0] as SVGElement, newColor, newOpacity, true);
        this.shapeChange(children[0] as SVGElement, newColor, newOpacity, false);
      }

      for (let i = 1; i < children.length; i++) {
        this.shapeChange(children[i] as SVGElement, newColor, newOpacity, true);
        this.shapeChange(children[i] as SVGElement, newColor, newOpacity, false);
      }
    }
  }

  private onRightClick(clickedElement: SVGElement): void {
    const newColor = this.colorSelectorService.secondaryColor.getValue().getHex();
    const newOpacity = this.colorSelectorService.secondaryTransparency.getValue().toString();

    switch (clickedElement.tagName) {
      case 'rect':
      case 'ellipse':
      case SVGProperties.polygon:
        this.shapeChange(clickedElement, newColor, newOpacity, false);
        break;
    }
  }

  private shapeChange(clickedElement: SVGElement, newColor: string, newOpacity: string, isFill: boolean): void {
    this.manipulator.setAttribute(clickedElement, isFill ? SVGProperties.fill : SVGProperties.color, newColor);
    this.manipulator.setAttribute(clickedElement, isFill ? SVGProperties.fillOpacity : SVGProperties.borderOpacity, newOpacity);
  }

  private pathChange(clickedElement: SVGElement, newColor: string, newOpacity: string): void {
    this.manipulator.setAttribute(clickedElement, SVGProperties.color, newColor);
    this.manipulator.setAttribute(clickedElement, SVGProperties.borderOpacity, newOpacity);
  }
}
