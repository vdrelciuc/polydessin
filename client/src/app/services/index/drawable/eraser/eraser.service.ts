import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { DrawableService } from '../drawable.service';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import * as CONSTANTS from '../../../../classes/constants';
import { SVGElementInfos } from 'src/app/interfaces/svg-element-infos';
import { UndoRedoService } from 'src/app/services/tools/undo-redo/undo-redo.service';
import { Color } from 'src/app/classes/color';
import { Stack } from 'src/app/classes/stack';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';

@Injectable({
  providedIn: 'root'
})
export class EraserService extends DrawableService {

  thickness: number;
  private selectedElement: SVGElementInfos;
  private oldBorder: string;
  private undoRedo: UndoRedoService;
  private elements: Stack<SVGElementInfos>;
  private leftClick: boolean;
  private preview: SVGRectElement;
  private canErase: boolean;

  constructor() { 
    super();
    this.frenchName = 'Efface';
    this.leftClick = false;
    this.canErase = true;
  }

  initialize(
    manipulator: Renderer2, 
    image:ElementRef<SVGElement>, 
    colorSelectorService: ColorSelectorService, 
    drawStack: DrawStackService): void {
      this.assignParams(manipulator, image, colorSelectorService, drawStack);
      this.initializeProperties();
      this.updateSVGElements();
  }

  initializeProperties(): void {
    this.thickness = this.attributes.thickness.value;
    this.attributes.thickness.subscribe((element: number) => {
      this.thickness = element;
    });
  }

  assignUndoRedo(undoRedo: UndoRedoService): void {
    this.undoRedo = undoRedo;
  }

  onMouseMove(event: MouseEvent): void {
    if(this.canErase) {
      this.updatePreview();
      this.manipulator.setAttribute(
        this.preview, 
        SVGProperties.x, 
        CoordinatesXY.effectiveX(this.image, event.clientX).toString()
      );
      this.manipulator.setAttribute(
        this.preview, 
        SVGProperties.y, 
        CoordinatesXY.effectiveY(this.image, event.clientY).toString()
      );
      if(this.selectedElement !== undefined)
      {
        const elementBounds = this.selectedElement.target.getBoundingClientRect();
        if(
          elementBounds.left   > event.clientX ||
          elementBounds.right  < event.clientX ||
          elementBounds.top    > event.clientY ||
          elementBounds.bottom < event.clientY       
          ) {
          this.manipulator.setAttribute(this.selectedElement.target.firstChild, SVGProperties.color, this.oldBorder);
          this.selectedElement = undefined as unknown as SVGElementInfos;
        }
      }
    }
  }

  onMouseOutCanvas(): void {
    this.canErase = false;
  }

  onMouseInCanvas(): void {
    this.canErase = true;
  }

  onClick(event: MouseEvent): void {
    this.deleteSelectedElement();
  }

  onMousePress(event: MouseEvent): void {
    if(event.button === CONSTANTS.MOUSE_LEFT) {
      this.leftClick = true;
    }
  }

  onMouseRelease(event: MouseEvent): void {
    if(event.button === CONSTANTS.MOUSE_LEFT) {
      this.leftClick = false;
    }
  }

  endTool(): void {
    this.leftClick = false;
    this.manipulator.removeChild(this.image, this.preview);
    if(this.selectedElement !== undefined) {
      this.manipulator.setAttribute(this.selectedElement.target.firstChild, SVGProperties.color, this.oldBorder);
    }
    for(let element of this.elements.getAll()) {
      element.target.removeEventListener('mouseover', () => {} );
    }
  }

  onSelect(): void {
    this.updateSVGElements();
    for(let element of this.elements.getAll()) {
      this.manipulator.listen(element.target, 'mouseover', (element) => {
        this.selectElement(element.target.parentElement as SVGGElement);
      });
    }
    this.preview = this.manipulator.createElement(SVGProperties.rectangle, 'http://www.w3.org/2000/svg');
    this.preview.setAttribute(SVGProperties.color, 'white');
    this.preview.setAttribute(SVGProperties.color, 'black');
    this.preview.setAttribute(SVGProperties.x, '0');
    this.preview.setAttribute(SVGProperties.y, '0');
    this.manipulator.appendChild(this.image.nativeElement, this.preview);
    this.updatePreview();
  }

  private updatePreview(): void {
    this.manipulator.setAttribute(this.preview, SVGProperties.height, this.thickness.toString());
    this.manipulator.setAttribute(this.preview, SVGProperties.width, this.thickness.toString());
  }

  private selectElement(element: SVGGElement): void {
    const elementOnTop = { target: element, id: Number(element.getAttribute(SVGProperties.title))};
    if(elementOnTop.target !== undefined) {      
      if(this.selectedElement === undefined) {
        this.selectedElement = elementOnTop;
        this.getColor();
      }
      if(this.selectedElement !== elementOnTop) {
        this.manipulator.setAttribute(this.selectedElement.target.firstChild, SVGProperties.color, this.oldBorder);
        this.selectedElement = elementOnTop;
        this.getColor();
      }
      this.setOutline(Color.areVisuallyEqualForRed(new Color(this.oldBorder), new Color(CONSTANTS.ERASER_OUTLINE)) ? 
          CONSTANTS.ERASER_OUTLINE_RED_ELEMENTS : CONSTANTS.ERASER_OUTLINE);
    }
    if(this.leftClick) {
      this.deleteSelectedElement();
    }
  }

  private deleteSelectedElement(): void {
    if(this.selectedElement !== undefined) {
      this.undoRedo.addToRemoved(this.selectedElement);
      this.drawStack.removeElement(this.selectedElement.id);
    }
  }

  private setOutline(colorToSet: string): void {
    this.manipulator.setAttribute(this.selectedElement.target.firstChild, SVGProperties.color, colorToSet);
  }

  private getColor(): void {
    const color = (this.selectedElement.target.firstChild as SVGElement).getAttribute(SVGProperties.color);
    if(color !== null) {
      this.oldBorder = color;
    }
  }

  private updateSVGElements(): void {
    const inSVG = this.image.nativeElement.querySelectorAll('g');
    this.elements = new Stack<SVGElementInfos>();
    inSVG.forEach((element) => {
      const id = element.getAttribute(SVGProperties.title);
      if(id !== null) {
        this.elements.push_back({
          target: element,
          id: Number(id)
        });
      }
    });
  }
}
