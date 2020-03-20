import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Color } from 'src/app/classes/color';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { Stack } from 'src/app/classes/stack';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { SVGElementInfos } from 'src/app/interfaces/svg-element-infos';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import * as CONSTANTS from '../../../../classes/constants';
import { DrawableService } from '../drawable.service';

@Injectable({
  providedIn: 'root'
})
export class EraserService extends DrawableService {

  thickness: BehaviorSubject<number>;
  private selectedElement: SVGElementInfos;
  private oldBorder: string;
  private elements: Stack<SVGElementInfos>;
  private leftClick: boolean;
  private mousePointer: SVGRectElement;
  private brushDelete: Stack<SVGElementInfos>;

  constructor() {
    super();
    this.frenchName = 'Efface';
    this.leftClick = false;
    this.thickness = new BehaviorSubject(CONSTANTS.THICKNESS_DEFAULT);
  }

  initialize(
    manipulator: Renderer2,
    image: ElementRef<SVGElement>,
    colorSelectorService: ColorSelectorService,
    drawStack: DrawStackService): void {
      this.assignParams(manipulator, image, colorSelectorService, drawStack);
      this.updateSVGElements();
      this.initializeProperties();
  }

  initializeProperties(): void {
    this.thickness.subscribe(() => {
      delete(this.mousePointer);
    });
  }

  onMouseMove(event: MouseEvent): void {
    this.updatePreview(new CoordinatesXY(event.clientX, event.clientY));
    if (this.selectedElement !== undefined) {
      const elementBounds = this.selectedElement.target.getBoundingClientRect();
      if (!this.getInBounds(elementBounds as DOMRect, new CoordinatesXY(event.clientX, event.clientY))) {
        this.manipulator.setAttribute(this.selectedElement.target.firstChild, SVGProperties.color, this.oldBorder);
        this.selectedElement = undefined as unknown as SVGElementInfos;
      }
    }

  }

  onMouseOutCanvas(): void {
    if (this.mousePointer !== undefined) {
      this.mousePointer.remove();
      delete(this.mousePointer);
    }
    this.leftClick = false;
  }

  onMouseInCanvas(event: MouseEvent): void {
    this.updatePreview(new CoordinatesXY(event.clientX, event.clientY));
  }

  onClick(event: MouseEvent): void {
    this.updatePreview(new CoordinatesXY(event.clientX, event.clientY));
    const target = (event.target as SVGGElement);
    if (
      target !== this.image.nativeElement
      && this.getInBounds(
        target.getBoundingClientRect() as DOMRect,
        new CoordinatesXY(event.clientX, event.clientY)
      )
      && target.getAttribute(SVGProperties.fill) !== null
      ) {
        this.deleteSelectedElement();
      }
  }

  onMousePress(event: MouseEvent): void {
    this.updatePreview(new CoordinatesXY(event.clientX, event.clientY));
    if (event.button === CONSTANTS.LEFT_CLICK) {
      this.leftClick = true;
      this.brushDelete = new Stack<SVGElementInfos>();
    }
  }

  onMouseRelease(event: MouseEvent): void {
    this.updatePreview(new CoordinatesXY(event.clientX, event.clientY));
    if(event.button === CONSTANTS.LEFT_CLICK) {
      this.leftClick = false;
      if (!this.brushDelete.isEmpty()) {
        this.mousePointer.remove();
        if (this.selectedElement !== undefined) {
          this.manipulator.setAttribute(this.selectedElement.target.firstChild, SVGProperties.color, this.oldBorder);
        }
        this.drawStack.addSVGWithNewElement(this.image.nativeElement.cloneNode(true) as SVGElement);
        this.manipulator.appendChild(this.image.nativeElement, this.mousePointer);
      }
    }
  }

  endTool(): void {
    this.leftClick = false;
    if (this.mousePointer !== undefined) {
      this.mousePointer.remove();
      delete(this.mousePointer);
    }
    if (this.selectedElement !== undefined) {
      this.manipulator.setAttribute(this.selectedElement.target.firstChild, SVGProperties.color, this.oldBorder);
      this.selectedElement = undefined as unknown as SVGElementInfos;
    }
    for (const element of this.elements.getAll()) {
      element.target.onmouseover = null;
    }
    delete(this.mousePointer);
  }

  onSelect(): void {
    this.updateSVGElements();
    for (const element of this.elements.getAll()) {
      element.target.onmouseover = (elementSVGInfo) => {
        if (elementSVGInfo.target !== null) {
          this.addingMouseMoveEvent(elementSVGInfo as unknown as SVGElementInfos);
        }
      };
    }
  }

  selectElement(element: SVGGElement): void {
    const elementOnTop = { target: element, id: Number(element.getAttribute(SVGProperties.title))};
    if (elementOnTop.target !== undefined) {
      if (this.leftClick) {
        const previous = this.brushDelete.pop_back();
        if (previous !== undefined) {
          previous.deleteWith = elementOnTop.id;
          this.brushDelete.push_back(previous);
        }
        this.brushDelete.push_back(elementOnTop);
        elementOnTop.target.remove();
        this.drawStack.removeElement(elementOnTop.id);
      } else {
        if (this.selectedElement === undefined) {
          this.selectedElement = elementOnTop;
          this.getColor();
        }
        if (this.selectedElement !== elementOnTop) {
          this.manipulator.setAttribute(this.selectedElement.target.firstChild, SVGProperties.color, this.oldBorder);
          this.selectedElement = elementOnTop;
          this.getColor();
        }
        this.setOutline((new Color(this.oldBorder).isSimilarTo(new Color(CONSTANTS.ERASER_OUTLINE))) ?
            CONSTANTS.ERASER_OUTLINE_RED_ELEMENTS : CONSTANTS.ERASER_OUTLINE);
      }
    }
  }

  private deleteSelectedElement(): void {
    if (this.selectedElement !== undefined) {
      this.manipulator.setAttribute(this.selectedElement.target.firstChild as SVGElement, SVGProperties.color, this.oldBorder);
      this.drawStack.removeElement(this.selectedElement.id);
      this.selectedElement.target.remove();
      this.mousePointer.remove();
      this.drawStack.addSVGWithNewElement(this.image.nativeElement.cloneNode(true) as SVGElement);
      this.manipulator.appendChild(this.image.nativeElement, this.mousePointer);
    }
  }

  private addingMouseMoveEvent(element: SVGElementInfos): void {
    this.selectElement(element.target.parentElement as unknown as SVGGElement);
  }

  private getInBounds(elementBounds: DOMRect, mouse: CoordinatesXY): boolean {
  return (
      elementBounds.left   < mouse.getX() + this.thickness.value / 2 &&
      elementBounds.right  > mouse.getX() - this.thickness.value / 2 &&
      elementBounds.top    < mouse.getY() + this.thickness.value / 2 &&
      elementBounds.bottom > mouse.getY() - this.thickness.value / 2
    );
  }

  private movePreview(mouse: CoordinatesXY): void {
    this.manipulator.setAttribute(
      this.mousePointer,
      SVGProperties.x,
      (CoordinatesXY.effectiveX(this.image, mouse.getX()) - this.thickness.value / 2).toString()
    );
    this.manipulator.setAttribute(
      this.mousePointer,
      SVGProperties.y,
      (CoordinatesXY.effectiveY(this.image, mouse.getY()) - this.thickness.value / 2).toString()
    );
  }

  private updatePreview(mouse: CoordinatesXY): void {
    if (this.mousePointer === undefined) {
      this.createPreview(mouse);
    } else {
      this.movePreview(mouse);
    }
  }

  protected createPreview(mouse: CoordinatesXY): void {
    this.mousePointer = this.manipulator.createElement(SVGProperties.rectangle, 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.mousePointer, 'style', 'pointer-events:none;');
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.color, 'black');
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.fill, 'white');
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.thickness, '5');
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.height, this.thickness.value.toString());
    this.manipulator.setAttribute(this.mousePointer, SVGProperties.width, this.thickness.value.toString());
    this.manipulator.appendChild(this.image.nativeElement, this.mousePointer);
    this.movePreview(mouse);
  }

  private setOutline(colorToSet: string): void {
    this.manipulator.setAttribute(this.selectedElement.target.firstChild, SVGProperties.color, colorToSet);
  }

  private getColor(): void {
    const color = (this.selectedElement.target.firstChild as SVGElement).getAttribute(SVGProperties.color);
    if (color !== null) {
      this.oldBorder = color;
    }
  }

  private updateSVGElements(): void {
    const inSVG = this.image.nativeElement.querySelectorAll('g');
    this.elements = new Stack<SVGElementInfos>();
    inSVG.forEach((element) => {
      const id = element.getAttribute(SVGProperties.title);
      if (id !== null) {
        this.elements.push_back({
          target: element,
          id: Number(id)
        });
      }
    });
  }
}
