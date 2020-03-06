import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { DrawableService } from '../drawable.service';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { CursorProperties } from 'src/app/classes/cursor-properties';
import { Tools } from 'src/app/enums/tools';
import { SVGElementInfos } from 'src/app/interfaces/svg-element-infos';
import { Stack } from 'src/app/classes/stack';
import { SelectionTransformShortcutService } from './selection-transform-shortcut.service';
import { Transform } from 'src/app/classes/transformations';
//import { InvertedElement } from 'src/app/interfaces/InvertedElement';

@Injectable({
  providedIn: 'root'
})
export class SelectionService extends DrawableService {

  readonly controlPointSize = 6;

  private mousePosition: CoordinatesXY;
  private selectionOrigin: CoordinatesXY;
  //private clickedElement: SVGGElement | null;
  private clickedElement: SVGElement | null;
  private isChanging: boolean;
  private isSingleClick: boolean;
  private isLeftClick: boolean;
  private selectionIsMoving: boolean;
  private isResizing: boolean;

  private perimeter: SVGRectElement;
  private perimeterAlternative: SVGRectElement;

  private selectionBox: DOMRect;
  private selectedElements: Stack<SVGElementInfos>;
  private selectionRect: SVGRectElement;
  private selectionGroup: SVGGElement;

  private controlPoints: SVGRectElement[];

  private elementsToInvert: Stack<SVGElementInfos>;
  private addedElements: Stack<SVGElementInfos>;
  private removedElements: Stack<SVGElementInfos>;

  private oldPointerOnMove: CoordinatesXY;

  private transFormShortcuts: SelectionTransformShortcutService;
  constructor() {
    super();
    this.frenchName = 'Sélection';
    this.selectedElements = new Stack<SVGElementInfos>();
    this.elementsToInvert = new Stack<SVGElementInfos>();
    this.transFormShortcuts = new SelectionTransformShortcutService();
  }

  initialize(manipulator: Renderer2, image: ElementRef, colorSelectorService: ColorSelectorService, drawStack: DrawStackService): void {
    this.assignParams(manipulator, image, colorSelectorService, drawStack);
    this.setupProperties();

    Transform.needsUpdate.subscribe(
      () => { this.setGeneratedAreaBorders(); }
    );
  }

  initializeProperties(): void {
  }

  cancelSelection(): void {
    if (this.subElement !== undefined) {
      this.manipulator.removeChild(this.image.nativeElement, this.subElement);
    }
    this.transFormShortcuts.deleteShortcuts();
  }

  onMousePress(event: MouseEvent): void {
    if (this.isChanging) {
      // This case happens if the mouse button was released out of canvas: the shaped is confirmed on next mouse click
      this.onMouseRelease(event);
    } else {
      if (this.subElement !== undefined) {
        this.manipulator.removeChild(this.image.nativeElement, this.subElement);
      }

      this.isChanging = true;
      this.isSingleClick = true;
      this.isLeftClick = event.button === 0 || this.selectedElements.isEmpty();
      this.elementsToInvert = new Stack<SVGElementInfos>();
      this.addedElements = new Stack<SVGElementInfos>();
      this.removedElements = new Stack<SVGElementInfos>();

      this.selectionOrigin = CoordinatesXY.getEffectiveCoords(this.image, event);
      this.mousePosition = CoordinatesXY.getEffectiveCoords(this.image, event);
      //this.clickedElement = (event.target as SVGGElement).parentNode as SVGGElement;
      this.clickedElement = event.target as SVGElement;


      this.selectionBox = new DOMRect(this.selectionOrigin.getX() + this.image.nativeElement.getBoundingClientRect().left, this.selectionOrigin.getY() + this.image.nativeElement.getBoundingClientRect().top);
      this.setupProperties();

      if (this.clickedElement !== null && this.clickedElement.getAttribute('title') === 'control-point' && this.isLeftClick) {
        // Resize -> Sprint 3
        this.isResizing = true;
        this.isSingleClick = false;
      } else if (this.clickedElement !== null && this.clickedElement.getAttribute('title') === 'selection-area' && this.isLeftClick) {
        const absoluteMousePosition = new CoordinatesXY(
          this.mousePosition.getX() + this.image.nativeElement.getBoundingClientRect().left,
          this.mousePosition.getY() + this.image.nativeElement.getBoundingClientRect().top
        );
        const topElement = this.drawStack.findTopElementAt(absoluteMousePosition);

        if (topElement !== undefined && this.selectedElements.contains(topElement)) {
          // Move selection
          this.oldPointerOnMove = CoordinatesXY.getEffectiveCoords(this.image, event);
          this.selectionIsMoving = true;
        }
      } else if (!this.isLeftClick || (this.clickedElement !== null && this.clickedElement.getAttribute('title') !== 'selection-area')) {
        // Selection of elements if not in selection area
        this.isLeftClick ? this.addTopElement() : this.invertTopElement();
        this.setGeneratedAreaBorders();
      }

    }
  }

  onMouseRelease(event: MouseEvent): void {
    if (this.isSingleClick && this.isLeftClick && this.clickedElement !== null && this.clickedElement.getAttribute('title') === 'selection-area') {
      this.addTopElement();
      this.setGeneratedAreaBorders();
    }

    this.isChanging = false;
    this.selectionIsMoving = false;
    this.isResizing = false;
    this.manipulator.removeChild(this.subElement, this.perimeter);
    this.manipulator.removeChild(this.subElement, this.perimeterAlternative);
    this.manipulator.setAttribute(this.selectionRect, CursorProperties.cursor, CursorProperties.move);
    this.transFormShortcuts.setupShortcuts(this.manipulator);
    if (this.selectedElements.isEmpty()) {
      this.cancelSelection();
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isChanging) {
      this.mousePosition = CoordinatesXY.getEffectiveCoords(this.image, event); // Save mouse position for KeyPress Event

      if (this.selectionIsMoving) {
        // Moving selection
        this.changePositionOnMove();
      } else if (this.isResizing) {
        // Resizing selection
        this.resizeOnMove();
      } else {
        // Selection of elements
        this.changeSelectionPerimeterOnMove();
      }
    }
  }

  private changeSelectionPerimeterOnMove(): void {
    if (this.isSingleClick && !this.isLeftClick) {
      // This case happens if a right click drag is initiated directly on an element
      this.invertTopElement();
    }
    this.isSingleClick = false;
    this.updateSize();
  }

  private changePositionOnMove(): void {
    this.isSingleClick = false;
    const translationX = this.mousePosition.getX() - this.oldPointerOnMove.getX();
    const translationY = this.mousePosition.getY() - this.oldPointerOnMove.getY();
    Transform.translate(translationX, translationY);
    this.oldPointerOnMove = new CoordinatesXY(this.mousePosition.getX(), this.mousePosition.getY());
  }

  private resizeOnMove(): void {
    // TODO: Sprint 3
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
    // Creating selection
    this.createSelectionRect();
    if (this.perimeter === undefined) {
      // Creating perimeter
      this.perimeter = this.manipulator.createElement(SVGProperties.rectangle, 'http://www.w3.org/2000/svg');
      this.perimeterAlternative = this.manipulator.createElement(SVGProperties.rectangle, 'http://www.w3.org/2000/svg');

      // Adding perimeter properties
      this.manipulator.setAttribute(this.perimeter, SVGProperties.fillOpacity, '10%');
      this.manipulator.setAttribute(this.perimeter, SVGProperties.thickness, '1');
      this.manipulator.setAttribute(this.perimeter, SVGProperties.dashedBorder, '4, 4');

      this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.fill, 'none');
      this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.thickness, '1');
      this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.dashedBorder, '4, 4');
      this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.dashedBorderOffset, '4');
    }
    const backgroundColor = this.colorSelectorService.backgroundColor.getValue();
    this.manipulator.setAttribute(this.perimeter, SVGProperties.color, backgroundColor.getInvertedColor(true).getHex());
    this.manipulator.setAttribute(this.perimeter, SVGProperties.fill, backgroundColor.getInvertedColor(false).getHex());
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.color, backgroundColor.getHex());

    // Reset dimensions attributes for perimeter
    this.manipulator.setAttribute(this.perimeter, SVGProperties.width, '0');
    this.manipulator.setAttribute(this.perimeter, SVGProperties.height, '0');
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.width, '0');
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.height, '0');

    // Adding perimeter to DOM
    this.manipulator.appendChild(this.subElement, this.perimeter);
    this.manipulator.appendChild(this.subElement, this.perimeterAlternative);
  }

  private createSelectionRect(): void {
    if (this.subElement === undefined) {
      this.subElement = this.manipulator.createElement('g', 'http://www.w3.org/2000/svg');
      this.selectionGroup = this.manipulator.createElement('g', 'http://www.w3.org/2000/svg');
      this.manipulator.setAttribute(this.subElement, SVGProperties.title, Tools.Selection);

      // Creating selection rectangle
      this.selectionRect = this.manipulator.createElement(SVGProperties.rectangle, 'http://www.w3.org/2000/svg');
      this.manipulator.setAttribute(this.selectionRect, SVGProperties.fillOpacity, '0');
      this.manipulator.setAttribute(this.selectionRect, SVGProperties.thickness, '1');
      this.manipulator.setAttribute(this.selectionRect, SVGProperties.title, 'selection-area');
      this.manipulator.appendChild(this.selectionGroup, this.selectionRect);

      // Creating control points
      this.controlPoints = new Array<SVGRectElement>(4);
      for (let i = 0; i < 4; i++) {
        this.controlPoints[i] = this.manipulator.createElement(SVGProperties.rectangle, 'http://www.w3.org/2000/svg');
        this.manipulator.setAttribute(this.controlPoints[i], SVGProperties.fill, 'white');
        this.manipulator.setAttribute(this.controlPoints[i], SVGProperties.color, 'black');
        this.manipulator.setAttribute(this.controlPoints[i], SVGProperties.thickness, '1');
        this.manipulator.setAttribute(this.controlPoints[i], SVGProperties.title, 'control-point');
        this.manipulator.setAttribute(this.controlPoints[i], SVGProperties.height, this.controlPointSize.toString());
        this.manipulator.setAttribute(this.controlPoints[i], SVGProperties.width, this.controlPointSize.toString());
        this.manipulator.appendChild(this.selectionGroup, this.controlPoints[i]);

        // Cursor on hover
        if (i < 2) {
          this.manipulator.setAttribute(this.controlPoints[i], CursorProperties.cursor, CursorProperties.vertical);
        } else {
          this.manipulator.setAttribute(this.controlPoints[i], CursorProperties.cursor, CursorProperties.horizontal);
        }
      }
      this.manipulator.appendChild(this.subElement, this.selectionGroup);
    }

    const backgroundColor = this.colorSelectorService.backgroundColor.getValue();
    this.manipulator.setAttribute(this.selectionRect, CursorProperties.cursor, CursorProperties.default);
    this.manipulator.setAttribute(this.selectionRect, SVGProperties.color, backgroundColor.getInvertedColor(true).getHex());
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
    this.isLeftClick ? /* Left click drag */ this.addEachElement() : /* Right click drag */ this.invertEachElement();
    this.setGeneratedAreaBorders();
  }

  private addTopElement(): void {
    this.selectedElements = new Stack<SVGElementInfos>();

    const absoluteMousePosition = new CoordinatesXY(
      this.mousePosition.getX() + this.image.nativeElement.getBoundingClientRect().left,
      this.mousePosition.getY() + this.image.nativeElement.getBoundingClientRect().top
    );
    const topElement = this.drawStack.findTopElementAt(absoluteMousePosition);

    if (topElement !== undefined) {
      this.selectedElements.push_back(topElement);
    }

    /*
    // Avec event.target
    if (this.clickedElement !== null) {
      const id = this.clickedElement.getAttribute('title');
      if (id !== null && this.clickedElement.tagName === 'g') {
        console.log(this.clickedElement);
        const topElement: SVGElementInfos = { target: this.clickedElement, id: parseInt(id) };
        this.selectedElements.push_back(topElement);
      }
    }*/
  }

  private invertTopElement(): void {
    const absoluteMousePosition = new CoordinatesXY(
      this.mousePosition.getX() + this.image.nativeElement.getBoundingClientRect().left,
      this.mousePosition.getY() + this.image.nativeElement.getBoundingClientRect().top
    );
    const topElement = this.drawStack.findTopElementAt(absoluteMousePosition);

    if (topElement !== undefined && !this.selectedElements.contains(topElement)) {
      this.selectedElements.push_back(topElement);
    } else if (topElement !== undefined) {
      this.selectedElements.delete(topElement);
    }

    /*
    // Avec event.target
    if (this.clickedElement !== null) {
      const id = this.clickedElement.getAttribute('title');
      if (id !== null && this.clickedElement.tagName === 'g') {
        console.log(this.clickedElement);
        const topElement: SVGElementInfos = { target: this.clickedElement, id: parseInt(id) };
        if (!this.selectedElements.contains(topElement)) {
          this.selectedElements.push_back(topElement);
        } else {
          this.selectedElements.delete(topElement);
        }
      }
    }*/
  }

  private addEachElement(): void {
    this.selectedElements = new Stack<SVGElementInfos>();

    for (let i = 0; i < this.drawStack.size(); i++) {
      const element = this.drawStack.hasElementIn(i, this.selectionBox);
      if (element !== undefined) {
        this.selectedElements.push_back(element);
      }
    }
  }

  private invertEachElement(): void {
    this.elementsToInvert = new Stack<SVGElementInfos>();

    for (let i = 0; i < this.drawStack.size(); i++) {
      const element = this.drawStack.hasElementIn(i, this.selectionBox);
      if (element !== undefined) {
        this.elementsToInvert.push_back(element);

        const isAlreadySelected = this.selectedElements.contains(element);
        const isAlreadyRemovedOrAdded = isAlreadySelected ? this.addedElements.contains(element) : this.removedElements.contains(element);

        if (!isAlreadyRemovedOrAdded) {
          isAlreadySelected ? this.selectedElements.delete(element) : this.selectedElements.push_back(element);
          isAlreadySelected ? this.removedElements.push_back(element) : this.addedElements.push_back(element);
        }
      }
    }

    for (let element of this.drawStack.getAll().getAll()) {
      if (this.addedElements.contains(element) && !this.elementsToInvert.contains(element)) {
        this.addedElements.delete(element);
        this.selectedElements.delete(element);
      } else if (this.removedElements.contains(element) && !this.elementsToInvert.contains(element)) {
        this.removedElements.delete(element);
        this.selectedElements.push_back(element);
      }
    }
  }

  selectAllElements(): void {
    this.cancelSelection();

    //this.selectedElements = this.drawStack.getAll();
    this.selectedElements = new Stack<SVGElementInfos>();
    for (let i = 0; i < this.drawStack.size(); i++) {
      this.selectedElements.push_back(this.drawStack.getAll().getAll()[i]);
    }
    this.createSelectionRect();
    this.manipulator.setAttribute(this.selectionRect, CursorProperties.cursor, CursorProperties.move);
    this.setGeneratedAreaBorders();
    if (this.selectedElements.isEmpty()) {
      this.cancelSelection();
    }
    this.transFormShortcuts.setupShortcuts(this.manipulator);
  }

  private setGeneratedAreaBorders(): void {
    /*const elementBorder = element.target.getBoundingClientRect();

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
    }*/
    const selection = this.selectedElements.getAll();

    if (selection.length > 0) {
      const firstElement = selection[0].target.getBoundingClientRect();
      let left = CoordinatesXY.effectiveX(this.image, firstElement.left);
      let right = CoordinatesXY.effectiveX(this.image, firstElement.right);
      let top = CoordinatesXY.effectiveY(this.image, firstElement.top);
      let bottom = CoordinatesXY.effectiveY(this.image, firstElement.bottom);

      for (let i = 1; i < selection.length; i++) {
        const boundingBox = selection[i].target.getBoundingClientRect();
        left = Math.min(left, CoordinatesXY.effectiveX(this.image, boundingBox.left));
        right = Math.max(right, CoordinatesXY.effectiveX(this.image, boundingBox.right));
        top = Math.min(top, CoordinatesXY.effectiveY(this.image, boundingBox.top));
        bottom = Math.max(bottom, CoordinatesXY.effectiveY(this.image, boundingBox.bottom));
      }
      // Set origin for perimeter
      this.manipulator.setAttribute(this.selectionRect, SVGProperties.x, left.toString());
      this.manipulator.setAttribute(this.selectionRect, SVGProperties.y, top.toString());
      // Set dimensions attributes for perimeter
      this.manipulator.setAttribute(this.selectionRect, SVGProperties.width, (right - left).toString());
      this.manipulator.setAttribute(this.selectionRect, SVGProperties.height, (bottom - top).toString());

      // Set control points positions :
      // Top
      this.manipulator.setAttribute(this.controlPoints[0], SVGProperties.x, ((right + left) / 2 - this.controlPointSize / 2).toString());
      this.manipulator.setAttribute(this.controlPoints[0], SVGProperties.y, (top - this.controlPointSize / 2).toString());
      // Bottom
      this.manipulator.setAttribute(this.controlPoints[1], SVGProperties.x, ((right + left) / 2 - this.controlPointSize / 2).toString());
      this.manipulator.setAttribute(this.controlPoints[1], SVGProperties.y, (bottom - this.controlPointSize / 2).toString());
      // Left
      this.manipulator.setAttribute(this.controlPoints[2], SVGProperties.x, (left - this.controlPointSize / 2).toString());
      this.manipulator.setAttribute(this.controlPoints[2], SVGProperties.y, ((top + bottom) / 2 - this.controlPointSize / 2).toString());
      // Right
      this.manipulator.setAttribute(this.controlPoints[3], SVGProperties.x, (right - this.controlPointSize / 2).toString());
      this.manipulator.setAttribute(this.controlPoints[3], SVGProperties.y, ((top + bottom) / 2 - this.controlPointSize / 2).toString());

      this.manipulator.appendChild(this.subElement, this.selectionGroup);

      Transform.setElements(this.selectedElements, this.manipulator);
    } else {
      this.manipulator.removeChild(this.subElement, this.selectionGroup);
    }
  }
}
