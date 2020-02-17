import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { DrawableService } from '../drawable.service';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import * as CONSTANTS from '../../../../classes/constants';
import { SVGElementInfos } from 'src/app/interfaces/svg-element-infos';

@Injectable({
  providedIn: 'root'
})
export class EraserService extends DrawableService {

  thickness: number;
  private selectedElement: SVGElementInfos;
  private oldBorder: string;

  constructor() { 
    super();
    this.frenchName = 'Efface';
  }

  initialize(
    manipulator: Renderer2, 
    image:ElementRef<SVGElement>, 
    colorSelectorService: ColorSelectorService, 
    drawStack: DrawStackService): void {
      this.assignParams(manipulator, image, colorSelectorService, drawStack);
      this.initializeProperties();
  }

  initializeProperties(): void {
    this.thickness = this.attributes.thickness.value;
    this.attributes.thickness.subscribe((element: number) => {
      this.thickness = element;
    });
  }

  onMouseMove(event: MouseEvent): void {
    let elementOnTop = this.drawStack.findTopElementAt(new CoordinatesXY(
        event.clientX, 
         event.clientY));
    if(elementOnTop !== undefined) {      
      if(this.selectedElement === undefined) {
        this.selectedElement = elementOnTop;
      }
      if(this.selectedElement !== elementOnTop) {
        this.manipulator.setAttribute(this.selectedElement.target.firstChild, SVGProperties.color, this.oldBorder);
        this.selectedElement = elementOnTop;
      }
      const color = this.selectedElement.target.getAttribute(SVGProperties.color); // NO I HAVE TO THE COLOR OF .firstChild
      if(color !== null) {
        this.oldBorder = color;
      }
      this.manipulator.setAttribute(this.selectedElement.target.firstChild, SVGProperties.color, CONSTANTS.ERASER_OUTLINE);
    }
  }

  onClick(event: MouseEvent): void {
    if(this.selectedElement !== undefined) {
      // this.manipulator.setAttribute(this.selectedElement.target.firstChild, SVGProperties.color, this.oldBorder);
      this.drawStack.removeElement(this.selectedElement.id);
    }
  }
}
