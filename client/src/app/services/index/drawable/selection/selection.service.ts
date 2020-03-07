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
import { SelectionState } from 'src/app/enums/selection-states';
//import { InvertedElement } from 'src/app/interfaces/InvertedElement';

@Injectable({
  providedIn: 'root'
})
export class SelectionService extends DrawableService {

  private readonly CONTROLPOINT_SIZE = 6;

  private mousePosition: CoordinatesXY;
  private selectionOrigin: CoordinatesXY;
  //private clickedElement: SVGGElement | null;
  private clickedElement: SVGElementInfos | null;

  private state: SelectionState = SelectionState.idle;

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

  private oldMousePosition: CoordinatesXY;

  private transformShortcuts: SelectionTransformShortcutService;

  constructor() {
    super();
    this.frenchName = 'Sélection';
    this.selectedElements = new Stack<SVGElementInfos>();
    this.elementsToInvert = new Stack<SVGElementInfos>();
    this.transformShortcuts = new SelectionTransformShortcutService();
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
    this.selectedElements = new Stack<SVGElementInfos>();
    if (this.subElement !== undefined) {
      this.manipulator.removeChild(this.image.nativeElement, this.subElement);
    }
    this.transformShortcuts.deleteShortcuts();
  }

  onMousePress(event: MouseEvent): void {
    /*if (this.isChanging) {
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

      const absoluteMousePosition = new CoordinatesXY(
        this.mousePosition.getX() + this.image.nativeElement.getBoundingClientRect().left,
        this.mousePosition.getY() + this.image.nativeElement.getBoundingClientRect().top
      );

      if (this.clickedElement !== null && this.clickedElement.getAttribute('title') === 'control-point' && this.isLeftClick) {
        // Resize -> Sprint 3
        this.isResizing = true;
        this.isSingleClick = false;
      } else if (this.clickedElement !== null && this.isInSelectionArea(absoluteMousePosition) && this.isLeftClick) {
        
        const topElement = this.drawStack.findTopElementAt(absoluteMousePosition);

        if (topElement !== undefined && this.selectedElements.contains(topElement)) {
          // Move selection
          this.oldPointerOnMove = CoordinatesXY.getEffectiveCoords(this.image, event);
          this.selectionIsMoving = true;
        }
      } else if (!this.isLeftClick || (this.clickedElement !== null && !this.isInSelectionArea(absoluteMousePosition))) {
        // Selection of elements if not in selection area
        this.isLeftClick ? this.addTopElement() : this.invertTopElement();
        this.setGeneratedAreaBorders();
      }

    }*/

    this.selectionOrigin = CoordinatesXY.getEffectiveCoords(this.image, event);
    this.oldMousePosition = this.selectionOrigin;

    let controlPointClicked = -1;
    for (let i = 0; i < this.controlPoints.length; i++) {
      if (this.controlPoints[i] === event.target) {
        controlPointClicked = i;
        break;
      }
    }
    const target = (event.target as SVGGElement).parentNode as SVGGElement;
    this.clickedElement = null;
    for (let groupElement of this.drawStack.getAll().getAll()) {
      if (groupElement.target === target) {
        this.clickedElement = groupElement;
        break;
      }
    }
    console.log(this.clickedElement);

    if (this.state !== SelectionState.idle) {
      // This case happens if the mouse button was released out of canvas: the shaped is confirmed on next mouse click
      this.onMouseRelease(event);
    } else if (event.button === 0) {
      // Left click
      if (controlPointClicked !== -1) {
        this.state = SelectionState.resizingTop + controlPointClicked;
      } else if (this.isInSelectionArea(new CoordinatesXY(event.clientX, event.clientY)) && (this.clickedElement === null || this.selectedElements.contains(this.clickedElement))) {
        this.state = SelectionState.leftClickInSelection;
      } else {
        this.state = SelectionState.singleLeftClickOutOfSelection;
        this.onSingleClick();
        this.manipulator.appendChild(this.image.nativeElement, this.subElement);
      }
    } else {
      // Right click
      this.state = SelectionState.singleRightClick;
    }
  }

  private isInSelectionArea(position: CoordinatesXY) : boolean {
    const element = this.selectionRect.getBoundingClientRect();
    const isIncludedX = position.getX() <= element.right && position.getX() >= element.left;
    const isIncludedY = position.getY() <= element.bottom && position.getY() >= element.top;

    return isIncludedX && isIncludedY;
  }

  onMouseRelease(event: MouseEvent): void {
    /*if (this.isSingleClick && this.isLeftClick && this.clickedElement !== null && this.clickedElement.getAttribute('title') === 'selection-area') {
      this.addOrRemoveTopElement();
      this.setGeneratedAreaBorders();
    }

    this.isChanging = false;
    this.selectionIsMoving = false;
    this.isResizing = false;
    this.manipulator.removeChild(this.subElement, this.perimeter);
    this.manipulator.removeChild(this.subElement, this.perimeterAlternative);
    //this.manipulator.setAttribute(this.selectionRect, CursorProperties.cursor, CursorProperties.move);
    this.transFormShortcuts.setupShortcuts(this.manipulator);
    if (this.selectedElements.isEmpty()) {
      this.cancelSelection();
    }*/

    switch (this.state) {
      case SelectionState.leftClickInSelection:
      case SelectionState.singleLeftClickOutOfSelection:
      case SelectionState.singleRightClick:
        this.onSingleClick();
        this.manipulator.appendChild(this.image.nativeElement, this.subElement);
        break;
      case SelectionState.inverting:
      case SelectionState.selecting:
        this.removePerimeter();
        break;
    }
    
    this.invertSelection();
      
    this.transformShortcuts.setupShortcuts(this.manipulator);
    if (this.selectedElements.isEmpty()) {
      this.cancelSelection();
    }

    this.state = SelectionState.idle;
  }

  onMouseMove(event: MouseEvent): void {
    /*if (this.isChanging) {
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
    }*/

    /*if (this.state === SelectionState.singleLeftClick) {
      this.state = SelectionState.selecting;
    } else if (this.state === )*/

    switch (this.state) {
      case SelectionState.singleLeftClickOutOfSelection:
        this.state = SelectionState.selecting;
        this.manipulator.appendChild(this.image.nativeElement, this.subElement);
        this.appendPerimeter();
        break;
      case SelectionState.singleRightClick:
        this.state = SelectionState.inverting;
        this.manipulator.appendChild(this.image.nativeElement, this.subElement);
        this.appendPerimeter();
        break;
      case SelectionState.leftClickInSelection:
        this.state = SelectionState.moving;
        break;
    }

    switch (this.state) {
      case SelectionState.selecting:
      case SelectionState.inverting:
        this.updateSelectionRect(CoordinatesXY.getEffectiveCoords(this.image, event));
        this.addOrInvertEachElementInRect();
        break;
      case SelectionState.moving:
        this.changePositionOnMove(CoordinatesXY.getEffectiveCoords(this.image, event));
        break;
    }
  }

  private changePositionOnMove(mousePosition: CoordinatesXY): void {
    const translationX = mousePosition.getX() - this.oldMousePosition.getX();
    const translationY = mousePosition.getY() - this.oldMousePosition.getY();
    Transform.translate(translationX, translationY);
    this.oldMousePosition = new CoordinatesXY(mousePosition.getX(), mousePosition.getY());
  }

  private resizeOnMove(): void {
    // TODO: Sprint 3
  }

  private updateSelectionRect(mousePosition: CoordinatesXY): void {
    let width = Math.abs(mousePosition.getX() - this.selectionOrigin.getX());
    let height = Math.abs(mousePosition.getY() - this.selectionOrigin.getY());

    //Set selection box
    const boxOrigin = new CoordinatesXY(Math.min(this.selectionOrigin.getX(), mousePosition.getX()), Math.min(this.selectionOrigin.getY(), mousePosition.getY()));
    this.selectionBox = new DOMRect(boxOrigin.getX() + this.image.nativeElement.getBoundingClientRect().left, boxOrigin.getY() + this.image.nativeElement.getBoundingClientRect().top, width, height);

    // Set dimensions attributes for perimeter
    this.manipulator.setAttribute(this.perimeter, SVGProperties.width, width.toString());
    this.manipulator.setAttribute(this.perimeter, SVGProperties.height, height.toString());
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.width, width.toString());
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.height, height.toString());

    // Set dimensions attributes for perimeter
    this.manipulator.setAttribute(this.perimeter, SVGProperties.x, boxOrigin.getX().toString());
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.x, boxOrigin.getX().toString());
    this.manipulator.setAttribute(this.perimeter, SVGProperties.y, boxOrigin.getY().toString());
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.y, boxOrigin.getY().toString());
  }

  private setupProperties(): void {
    // Creating perimeter
    this.perimeter = this.manipulator.createElement(SVGProperties.rectangle, 'http://www.w3.org/2000/svg');
    this.perimeterAlternative = this.manipulator.createElement(SVGProperties.rectangle, 'http://www.w3.org/2000/svg');

    // Adding perimeter properties
    this.manipulator.setAttribute(this.perimeter, SVGProperties.fillOpacity, '10%');
    this.manipulator.setAttribute(this.perimeter, SVGProperties.thickness, '1');
    this.manipulator.setAttribute(this.perimeter, SVGProperties.dashedBorder, '4, 4');
    this.manipulator.setAttribute(this.perimeter, SVGProperties.color, 'black');
    this.manipulator.setAttribute(this.perimeter, SVGProperties.fill, 'grey');

    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.fill, 'none');
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.thickness, '1');
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.dashedBorder, '4, 4');
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.dashedBorderOffset, '4');
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.color, 'white');

    this.subElement = this.manipulator.createElement('g', 'http://www.w3.org/2000/svg');
    this.selectionGroup = this.manipulator.createElement('g', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.subElement, SVGProperties.title, Tools.Selection);

    // Creating selection rectangle
    this.selectionRect = this.manipulator.createElement(SVGProperties.rectangle, 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.selectionRect, SVGProperties.fill, 'none');
    this.manipulator.setAttribute(this.selectionRect, SVGProperties.thickness, '1');
    this.manipulator.setAttribute(this.selectionRect, SVGProperties.color, 'black');
    this.manipulator.setAttribute(this.selectionRect, SVGProperties.title, 'selection-area');
    this.manipulator.appendChild(this.selectionGroup, this.selectionRect);

    // Creating control points
    this.controlPoints = new Array<SVGRectElement>(4);
    for (let i = 0; i < 4; i++) {
      this.controlPoints[i] = this.manipulator.createElement(SVGProperties.rectangle, 'http://www.w3.org/2000/svg');
      this.manipulator.setAttribute(this.controlPoints[i], SVGProperties.fill, 'white');
      this.manipulator.setAttribute(this.controlPoints[i], SVGProperties.color, 'black');
      this.manipulator.setAttribute(this.controlPoints[i], SVGProperties.thickness, '1');
      this.manipulator.setAttribute(this.controlPoints[i], SVGProperties.title, `control-point${i + 1}`);
      this.manipulator.setAttribute(this.controlPoints[i], SVGProperties.height, this.CONTROLPOINT_SIZE.toString());
      this.manipulator.setAttribute(this.controlPoints[i], SVGProperties.width, this.CONTROLPOINT_SIZE.toString());
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

  private appendPerimeter(): void {
    // Adding perimeter to DOM
    this.manipulator.appendChild(this.subElement, this.perimeter);
    this.manipulator.appendChild(this.subElement, this.perimeterAlternative);
  }

  private removePerimeter(): void {
    // Removing perimeter from DOM
    this.manipulator.removeChild(this.subElement, this.perimeter);
    this.manipulator.removeChild(this.subElement, this.perimeterAlternative);
  }

  private createSelectionRect(): void {
    //this.manipulator.setAttribute(this.selectionRect, CursorProperties.cursor, CursorProperties.default);
    this.manipulator.appendChild(this.image.nativeElement, this.subElement);
  }

  private onSingleClick(): void {
    if (this.clickedElement !== null) {
      switch (this.state) {
        case SelectionState.singleLeftClickOutOfSelection:
          this.state = SelectionState.leftClickInSelection;
        case SelectionState.leftClickInSelection:
          this.selectedElements = new Stack<SVGElementInfos>();
          this.selectedElements.push_back(this.clickedElement);
          break;
        case SelectionState.singleRightClick:
          this.selectedElements.contains(this.clickedElement) ? this.selectedElements.delete(this.clickedElement) : this.selectedElements.push_back(this.clickedElement);
          break;
      }
    } else if (this.state === SelectionState.leftClickInSelection || this.state === SelectionState.singleLeftClickOutOfSelection) {
      this.selectedElements = new Stack<SVGElementInfos>();
    }
    
    this.setGeneratedAreaBorders();


    /*const absoluteMousePosition = new CoordinatesXY(
      this.mousePosition.getX() + this.image.nativeElement.getBoundingClientRect().left,
      this.mousePosition.getY() + this.image.nativeElement.getBoundingClientRect().top
    );
    const topElement = this.drawStack.findTopElementAt(absoluteMousePosition);

    if (topElement !== undefined) {
      this.selectedElements.push_back(topElement);
    }*/

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

  private invertSelection() {
    for (let element of this.elementsToInvert.getAll()) {
      if (this.selectedElements.contains(element)) {
        this.selectedElements.delete(element);
      } else {
        this.selectedElements.push_back(element);
      }
    }

    this.elementsToInvert = new Stack<SVGElementInfos>();
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

  private addOrInvertEachElementInRect(): void {
    /*this.selectedElements = new Stack<SVGElementInfos>();

    for (let i = 0; i < this.drawStack.size(); i++) {
      const element = this.drawStack.hasElementIn(i, this.selectionBox);
      if (element !== undefined) {
        this.selectedElements.push_back(element);
      }
    }*/

    let stack = new Stack<SVGElementInfos>();

    for (let i = 0; i < this.drawStack.size(); i++) {
      const element = this.drawStack.hasElementIn(i, this.selectionBox);
      if (element !== undefined) {
        stack.push_back(element);
      }
    }

    if (this.state === SelectionState.selecting) {
      this.selectedElements = stack;
    } else {
      this.elementsToInvert = stack;
    }

    this.setGeneratedAreaBorders();
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
    //this.createSelectionRect();
    //this.manipulator.setAttribute(this.selectionRect, CursorProperties.cursor, CursorProperties.move);
    this.setGeneratedAreaBorders();
    if (this.selectedElements.isEmpty()) {
      this.cancelSelection();
    }
    this.transformShortcuts.setupShortcuts(this.manipulator);
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
    let selection: SVGElementInfos[] = [];
    for (const element of this.selectedElements.getAll()) {
      selection.push(element);
    }
    
    for (let element of this.elementsToInvert.getAll()) {
      const indexToRemove = selection.indexOf(element);
      if (indexToRemove !== -1) {
        selection.splice(indexToRemove, 1);
      } else {
        selection.push(element);
      }
    }
  

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
      this.manipulator.setAttribute(this.controlPoints[0], SVGProperties.x, ((right + left) / 2 - this.CONTROLPOINT_SIZE / 2).toString());
      this.manipulator.setAttribute(this.controlPoints[0], SVGProperties.y, (top - this.CONTROLPOINT_SIZE / 2).toString());
      // Bottom
      this.manipulator.setAttribute(this.controlPoints[1], SVGProperties.x, ((right + left) / 2 - this.CONTROLPOINT_SIZE / 2).toString());
      this.manipulator.setAttribute(this.controlPoints[1], SVGProperties.y, (bottom - this.CONTROLPOINT_SIZE / 2).toString());
      // Left
      this.manipulator.setAttribute(this.controlPoints[2], SVGProperties.x, (left - this.CONTROLPOINT_SIZE / 2).toString());
      this.manipulator.setAttribute(this.controlPoints[2], SVGProperties.y, ((top + bottom) / 2 - this.CONTROLPOINT_SIZE / 2).toString());
      // Right
      this.manipulator.setAttribute(this.controlPoints[3], SVGProperties.x, (right - this.CONTROLPOINT_SIZE / 2).toString());
      this.manipulator.setAttribute(this.controlPoints[3], SVGProperties.y, ((top + bottom) / 2 - this.CONTROLPOINT_SIZE / 2).toString());

      this.manipulator.appendChild(this.subElement, this.selectionGroup);

      Transform.setElements(this.selectedElements, this.manipulator);
    } else {
      this.manipulator.removeChild(this.subElement, this.selectionGroup);
    }
  }
}
