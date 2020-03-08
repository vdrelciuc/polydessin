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
import { BoundingBox } from 'src/app/interfaces/bounding-box';

@Injectable({
  providedIn: 'root'
})
export class SelectionService extends DrawableService {

  private readonly CONTROLPOINT_SIZE = 6;

  private selectionOrigin: CoordinatesXY;
  private clickedElement: SVGElementInfos | null;

  private state: SelectionState = SelectionState.idle;

  private perimeter: SVGRectElement;
  private perimeterAlternative: SVGRectElement;

  private selectionBox: DOMRect;
  private selectedElements: Stack<SVGElementInfos>;
  private selectionRect: SVGRectElement;
  private selectionGroup: SVGGElement;
  private controlPoints: SVGRectElement[];

  private oldMousePosition: CoordinatesXY;
  private elementsToInvert: Stack<SVGElementInfos>;

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

  onMouseOutCanvas(event: MouseEvent): void {
    this.onMouseRelease(event);
  }

  onMousePress(event: MouseEvent): void {
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

    if (this.state !== SelectionState.idle) {
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
    this.state = SelectionState.idle;

    if (this.selectedElements.isEmpty()) {
      this.cancelSelection();
    }
  }

  onMouseMove(event: MouseEvent): void {
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

  private updateSelectionRect(mousePosition: CoordinatesXY): void {
    let width = Math.abs(mousePosition.getX() - this.selectionOrigin.getX());
    let height = Math.abs(mousePosition.getY() - this.selectionOrigin.getY());

    //Set selection box
    const boxOrigin = new CoordinatesXY(Math.min(this.selectionOrigin.getX(), mousePosition.getX()), Math.min(this.selectionOrigin.getY(), mousePosition.getY()));
    this.selectionBox = new DOMRect(boxOrigin.getX() + this.image.nativeElement.getBoundingClientRect().left, boxOrigin.getY() + this.image.nativeElement.getBoundingClientRect().top, width, height);

    // Set dimensions attributes for perimeter and align origin
    this.manipulator.setAttribute(this.perimeter, SVGProperties.x, boxOrigin.getX().toString());
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.x, boxOrigin.getX().toString());
    this.manipulator.setAttribute(this.perimeter, SVGProperties.y, boxOrigin.getY().toString());
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.y, boxOrigin.getY().toString());
    this.manipulator.setAttribute(this.perimeter, SVGProperties.width, width.toString());
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.width, width.toString());
    this.manipulator.setAttribute(this.perimeter, SVGProperties.height, height.toString());
    this.manipulator.setAttribute(this.perimeterAlternative, SVGProperties.height, height.toString());
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
    this.manipulator.appendChild(this.subElement, this.perimeter);
    this.manipulator.appendChild(this.subElement, this.perimeterAlternative);
  }

  private removePerimeter(): void {
    this.manipulator.removeChild(this.subElement, this.perimeter);
    this.manipulator.removeChild(this.subElement, this.perimeterAlternative);
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
  }

  private invertSelection(): void {
    for (let element of this.elementsToInvert.getAll()) {
      this.selectedElements.contains(element) ? this.selectedElements.delete(element) : this.selectedElements.push_back(element);
    }
    this.elementsToInvert = new Stack<SVGElementInfos>();
  }

  private addOrInvertEachElementInRect(): void {
    let stack = new Stack<SVGElementInfos>();

    for (let i = 0; i < this.drawStack.size(); i++) {
      const element = this.drawStack.hasElementIn(i, this.selectionBox);
      if (element !== undefined) {
        stack.push_back(element);
      }
    }

    this.state === SelectionState.selecting ? this.selectedElements = stack : this.elementsToInvert = stack;
    this.setGeneratedAreaBorders();
  }

  selectAllElements(): void {
    this.selectedElements = this.drawStack.getAll();
    this.setGeneratedAreaBorders();
    this.manipulator.appendChild(this.image.nativeElement, this.subElement);
    this.transformShortcuts.setupShortcuts(this.manipulator);
  }

  private setGeneratedAreaBorders(): void {
    let selection: SVGElementInfos[] = [];
    for (const element of this.selectedElements.getAll()) {
      selection.push(element);
    }
    
    for (let element of this.elementsToInvert.getAll()) {
      const indexToRemove = selection.indexOf(element);
      indexToRemove === -1 ? selection.push(element) : selection.splice(indexToRemove, 1);
    }

    if (selection.length > 0) {
      const firstElement = this.getBBoxWithStroke(selection[0].target);
      let left = CoordinatesXY.effectiveX(this.image, firstElement.left);
      let right = CoordinatesXY.effectiveX(this.image, firstElement.right);
      let top = CoordinatesXY.effectiveY(this.image, firstElement.top);
      let bottom = CoordinatesXY.effectiveY(this.image, firstElement.bottom);

      for (let i = 1; i < selection.length; i++) {
        const boundingBox = this.getBBoxWithStroke(selection[i].target);
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

  private getBBoxWithStroke(element: SVGGElement): BoundingBox {
    const gElementBoundingBox = element.getBoundingClientRect();
    const firstChild = element.firstChild as HTMLElement;
    const thickness = firstChild.getAttribute(SVGProperties.thickness);
    if (thickness !== null && (firstChild.tagName === 'path' || firstChild.tagName === 'polyline')) {
      const firstChildBBox = firstChild.getBoundingClientRect();
      return {
        left: Math.min(gElementBoundingBox.left, firstChildBBox.left - parseInt(thickness) / 2),
        right: Math.max(gElementBoundingBox.right, firstChildBBox.right + parseInt(thickness) / 2),
        top: Math.min(gElementBoundingBox.top, firstChildBBox.top - parseInt(thickness) / 2),
        bottom: Math.max(gElementBoundingBox.bottom, firstChildBBox.bottom + parseInt(thickness) / 2)
      };
    }
    return {
      left: gElementBoundingBox.left,
      right: gElementBoundingBox.right,
      top: gElementBoundingBox.top,
      bottom: gElementBoundingBox.bottom
    };
  }
}
