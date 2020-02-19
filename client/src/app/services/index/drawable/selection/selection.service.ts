import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { DrawableService } from '../drawable.service';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { Tools } from 'src/app/enums/tools';
import { SVGElementInfos } from 'src/app/interfaces/svg-element-infos';
import { Stack } from 'src/app/classes/stack';
import { Area } from 'src/app/interfaces/area';

@Injectable({
  providedIn: 'root'
})
export class SelectionService extends DrawableService {

  private mousePosition: CoordinatesXY;
  private selectionOrigin: CoordinatesXY;
  private isChanging: boolean;

  private subElement: SVGGElement;
  private perimeter: SVGRectElement;
  private perimeterAlternative: SVGRectElement;

  private selectionBox: DOMRect;
  private selectedElements: Stack<SVGElementInfos>;
  private generatedArea: Area;

  constructor() {
    super();
    this.frenchName = 'Sélection';
    this.selectedElements = new Stack<SVGElementInfos>();
  }

  initialize(manipulator: Renderer2, image: ElementRef, colorSelectorService: ColorSelectorService, drawStack: DrawStackService): void {
    this.assignParams(manipulator, image, colorSelectorService, drawStack);
  }

  initializeProperties(): void {
  }

  onMousePress(event: MouseEvent): void {
    if (this.isChanging) {
      // This case happens if the mouse button was released out of canvas: the shaped is confirmed on next mouse click
      this.onMouseRelease(event);
    } else {
      if (this.subElement !== undefined) {
        this.manipulator.removeChild(this.image.nativeElement, this.subElement);
      }
      this.selectionOrigin = CoordinatesXY.getEffectiveCoords(this.image, event);
      this.selectionBox = new DOMRect(this.selectionOrigin.getX() + this.image.nativeElement.getBoundingClientRect().left, this.selectionOrigin.getY() + this.image.nativeElement.getBoundingClientRect().top);
      this.updateSelectedElements();
      this.setupProperties();
      this.isChanging = true;
    }

  }

  onMouseRelease(event: MouseEvent): void {
    this.isChanging = false;
    if (this.selectedElements.getAll().length !== 0) {
      this.fixSelectionBorder();
    } else {
      this.manipulator.removeChild(this.image.nativeElement, this.subElement);
    }
    delete this.generatedArea;
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isChanging) {
      this.mousePosition = CoordinatesXY.getEffectiveCoords(this.image, event); // Save mouse position for KeyPress Event
      this.updateSize();
    }
  }

  private updateSize(): void {
    let width = Math.abs(this.mousePosition.getX() - this.selectionOrigin.getX());
    let height = Math.abs(this.mousePosition.getY() - this.selectionOrigin.getY());

    //Set selection box
    const boxOrigin = new CoordinatesXY(Math.min(this.selectionOrigin.getX(), this.mousePosition.getX()), Math.min(this.selectionOrigin.getY(), this.mousePosition.getY()));
    this.selectionBox = new DOMRect(boxOrigin.getX() + this.image.nativeElement.getBoundingClientRect().left, boxOrigin.getY() + this.image.nativeElement.getBoundingClientRect().top, width, height);
    this.updateSelectedElements();

    // Set dimensions attributes for perimeter
    this.manipulator.setAttribute(this.perimeter, SVGProperties.width, width.toString());
    this.manipulator.setAttribute(this.perimeter, SVGProperties.height, height.toString());
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.width, width.toString());
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.height, height.toString());

    // Set dimensions attributes for perimeter
    this.alignselectionOrigin(width, height);
  }

  private setupProperties(): void {
    // Creating perimeter
    this.subElement = this.manipulator.createElement('g', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.subElement, SVGProperties.title, Tools.Selection);
    this.perimeter = this.manipulator.createElement(SVGProperties.rectangle, 'http://www.w3.org/2000/svg');
    this.perimeterAlternative = this.manipulator.createElement(SVGProperties.rectangle, 'http://www.w3.org/2000/svg');

    // Adding perimeter properties
    const backgroundColor = this.colorSelectorService.backgroundColor.getValue();
    this.manipulator.setAttribute(this.perimeter, SVGProperties.fill, 'none');
    this.manipulator.setAttribute(this.perimeter, SVGProperties.color, backgroundColor.getInvertedColor(true).getHex());
    this.manipulator.setAttribute(this.perimeter, SVGProperties.thickness, '1');
    this.manipulator.setAttribute(this.perimeter, SVGProperties.dashedBorder, '4, 4');

    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.fill, 'none');
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.color, backgroundColor.getHex());
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.thickness, '1');
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.dashedBorder, '4, 4');
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.dashedBorderOffset, '4');

    // Adding perimeter to DOM
    this.manipulator.appendChild(this.subElement, this.perimeter);
    this.manipulator.appendChild(this.subElement, this.perimeterAlternative);
    this.manipulator.appendChild(this.image.nativeElement, this.subElement);
  }

  private alignselectionOrigin(width: number, height: number): void {
    const quadrant = this.mousePosition.getQuadrant(this.selectionOrigin);

    if (quadrant === 1 || quadrant === 4) {
      this.manipulator.setAttribute(this.perimeter, SVGProperties.x, this.selectionOrigin.getX().toString());
      this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.x, this.selectionOrigin.getX().toString());
    } else {
      this.manipulator.setAttribute(this.perimeter, SVGProperties.x, this.mousePosition.getX().toString());
      this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.x, this.mousePosition.getX().toString());
    }

    if (quadrant === 3 || quadrant === 4) {
      this.manipulator.setAttribute(this.perimeter, SVGProperties.y, this.selectionOrigin.getY().toString());
      this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.y, this.selectionOrigin.getY().toString());
    } else {
      this.manipulator.setAttribute(this.perimeter, SVGProperties.y, this.mousePosition.getY().toString());
      this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.y, this.mousePosition.getY().toString());
    }
  }

  private updateSelectedElements(): void {
    this.selectedElements.clear();

    for (let i = 0; i < this.drawStack.size(); i++) {
      const element = this.drawStack.hasElementIn(i, this.selectionBox);
      if (element !== undefined) {
        this.selectedElements.push_back(element);
        this.setGeneratedAreaBorders(element);
      }
    }
    console.log(this.selectedElements);
  }

  private setGeneratedAreaBorders(element: SVGElementInfos): void {
    const elementBorder = element.target.getBoundingClientRect();

    const firstElementOfGroup = element.target.firstChild as SVGElement;
    const borderProperty = (firstElementOfGroup.tagName !== 'polyline') ? firstElementOfGroup.getAttribute(SVGProperties.thickness) : null;
    const borderThickness = parseInt((borderProperty !== null) ? borderProperty : '0') / 2;

    if (this.generatedArea === undefined) {
      this.generatedArea = {
        left: elementBorder.left - borderThickness,
        right: elementBorder.right + borderThickness,
        top: elementBorder.top + borderThickness,
        bottom: elementBorder.bottom - borderThickness
      };
    }
    if (elementBorder.left - borderThickness < this.generatedArea.left) {
      this.generatedArea.left = elementBorder.left - borderThickness;
    }
    if (elementBorder.right + borderThickness > this.generatedArea.right) {
      this.generatedArea.right = elementBorder.right + borderThickness;
    }
    if (elementBorder.top - borderThickness < this.generatedArea.top) {
      this.generatedArea.top = elementBorder.top - borderThickness;
    }
    if (elementBorder.bottom + borderThickness > this.generatedArea.bottom) {
      this.generatedArea.bottom = elementBorder.bottom + borderThickness;
    }
  }

  private fixSelectionBorder(): void {
    // Set origin for perimeter
    this.manipulator.setAttribute(this.perimeter, SVGProperties.x, CoordinatesXY.effectiveX(this.image, this.generatedArea.left).toString());
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.x, CoordinatesXY.effectiveX(this.image, this.generatedArea.left).toString());
    this.manipulator.setAttribute(this.perimeter, SVGProperties.y, CoordinatesXY.effectiveY(this.image, this.generatedArea.top).toString());
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.y, CoordinatesXY.effectiveY(this.image, this.generatedArea.top).toString());

    // Set dimensions attributes for perimeter
    const width = this.generatedArea.right - this.generatedArea.left;
    const height = this.generatedArea.bottom - this.generatedArea.top;
    this.manipulator.setAttribute(this.perimeter, SVGProperties.width, width.toString());
    this.manipulator.setAttribute(this.perimeter, SVGProperties.height, height.toString());
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.width, width.toString());
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.height, height.toString());
  }
}
