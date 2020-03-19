import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { CursorProperties } from 'src/app/classes/cursor-properties';
import { Stack } from 'src/app/classes/stack';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { Transform } from 'src/app/classes/transformations';
import { SelectionState } from 'src/app/enums/selection-states';
import { Tools } from 'src/app/enums/tools';
import { BoundingBox } from 'src/app/interfaces/bounding-box';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import { DrawableService } from '../drawable.service';
import { SelectionTransformShortcutService } from './selection-transform-shortcut.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionService extends DrawableService {
  private readonly CONTROL_SIZE: number = 6;
  private selectionOrigin: CoordinatesXY;
  private clickedElement: SVGGElement | null;
  private state: SelectionState = SelectionState.idle;
  private perimeter: SVGRectElement;
  private perimeterAlternative: SVGRectElement;
  private selectionBox: DOMRect;
  private selectedElements: Stack<SVGGElement>;
  private selectionRect: SVGRectElement;
  private resizeGroup: SVGGElement;
  private controlPoints: SVGRectElement[];
  private oldMousePosition: CoordinatesXY;
  private elementsToInvert: Stack<SVGGElement>;
  private transformShortcuts: SelectionTransformShortcutService;

  constructor() {
    super();
    this.frenchName = 'Sélection';
    this.selectedElements = new Stack<SVGGElement>();
    this.elementsToInvert = new Stack<SVGGElement>();
    this.transformShortcuts = new SelectionTransformShortcutService();
  }

  initialize(manipulator: Renderer2, image: ElementRef, colorSelectorService: ColorSelectorService, drawStack: DrawStackService): void {
    this.assignParams(manipulator, image, colorSelectorService, drawStack);
    this.setupProperties();
    Transform.needsUpdate.subscribe( () => { this.setGeneratedAreaBorders(); } );
  }
  initializeProperties(): void { /* No properties to initialize */ }
  cancelSelection(): void {
    this.selectedElements = new Stack<SVGGElement>();
    this.elementsToInvert = new Stack<SVGGElement>();
    if (this.subElement !== undefined) {
      this.manipulator.removeChild(this.image.nativeElement, this.subElement);
      this.manipulator.removeChild(this.image.nativeElement, this.resizeGroup);
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
    const target = (event.target as SVGElement).parentNode as SVGGElement;
    this.clickedElement = (target.tagName === 'APP-CANVAS' || target === this.resizeGroup) ? null : target;

    if (this.state !== SelectionState.idle) {
      this.onMouseRelease(event);
    } else if (event.button === 0) {
      // Left click
      if (controlPointClicked >= 0) {
        this.state = SelectionState.resizingTop + controlPointClicked;
      } else if (this.isInSelectionArea(new CoordinatesXY(event.clientX, event.clientY))
             && (this.clickedElement === null || this.selectedElements.contains(this.clickedElement))) {
        this.state = SelectionState.leftClickInSelection;
      } else {
        this.state = SelectionState.singleLeftClickOutOfSelection;
        this.onSingleClick();
      }
    } else { // Right click
      this.state = SelectionState.singleRightClick;
    }
  }

  private isInSelectionArea(position: CoordinatesXY): boolean {
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
        break;
      case SelectionState.inverting:
      case SelectionState.selecting:
        this.manipulator.removeChild(this.image.nativeElement, this.subElement);
        break;
      case SelectionState.moving:
        this.resizeGroup.remove();
        this.drawStack.addSVGWithNewElement(this.image.nativeElement.cloneNode(true) as SVGElement);
        this.manipulator.appendChild(this.image.nativeElement, this.resizeGroup);
        break;
    }
    this.invertSelection();
    this.transformShortcuts.setupShortcuts(this.manipulator, this.drawStack, this.image, this.resizeGroup);
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
        break;
      case SelectionState.singleRightClick:
        this.state = SelectionState.inverting;
        this.manipulator.appendChild(this.image.nativeElement, this.subElement);
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
    const width = Math.abs(mousePosition.getX() - this.selectionOrigin.getX());
    const height = Math.abs(mousePosition.getY() - this.selectionOrigin.getY());

    // Set selection box
    const boxOrigin = new CoordinatesXY(Math.min(this.selectionOrigin.getX(), mousePosition.getX()),
      Math.min(this.selectionOrigin.getY(), mousePosition.getY()));
    this.selectionBox = new DOMRect(boxOrigin.getX() + this.image.nativeElement.getBoundingClientRect().left,
      boxOrigin.getY() + this.image.nativeElement.getBoundingClientRect().top, width, height);

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
    this.resizeGroup = this.manipulator.createElement('g', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.subElement, SVGProperties.title, Tools.Selection);
    this.manipulator.appendChild(this.subElement, this.perimeter);
    this.manipulator.appendChild(this.subElement, this.perimeterAlternative);

    // Creating selection rectangle
    this.selectionRect = this.manipulator.createElement(SVGProperties.rectangle, 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.selectionRect, SVGProperties.fill, 'none');
    this.manipulator.setAttribute(this.selectionRect, SVGProperties.thickness, '1');
    this.manipulator.setAttribute(this.selectionRect, SVGProperties.color, 'black');
    this.manipulator.setAttribute(this.selectionRect, SVGProperties.title, 'selection-area');
    this.manipulator.setAttribute(this.selectionRect, 'pointer-events', 'none');
    this.manipulator.appendChild(this.resizeGroup, this.selectionRect);

    // Creating control points
    const controlPointQuantity = 4;
    this.controlPoints = new Array<SVGRectElement>(controlPointQuantity);
    for (let i = 0; i < controlPointQuantity; i++) {
      this.controlPoints[i] = this.manipulator.createElement(SVGProperties.rectangle, 'http://www.w3.org/2000/svg');
      this.manipulator.setAttribute(this.controlPoints[i], SVGProperties.fill, 'white');
      this.manipulator.setAttribute(this.controlPoints[i], SVGProperties.color, 'black');
      this.manipulator.setAttribute(this.controlPoints[i], SVGProperties.thickness, '1');
      this.manipulator.setAttribute(this.controlPoints[i], SVGProperties.title, `control-point${i + 1}`);
      this.manipulator.setAttribute(this.controlPoints[i], SVGProperties.height, this.CONTROL_SIZE.toString());
      this.manipulator.setAttribute(this.controlPoints[i], SVGProperties.width, this.CONTROL_SIZE.toString());
      this.manipulator.appendChild(this.resizeGroup, this.controlPoints[i]);
      this.manipulator.setAttribute(this.controlPoints[i], CursorProperties.cursor,
        (i < 2) ? CursorProperties.vertical : CursorProperties.horizontal);
    }
  }

  private onSingleClick(): void {
    if (this.clickedElement !== null) {
      switch (this.state) {
        case SelectionState.singleLeftClickOutOfSelection:
          this.state = SelectionState.leftClickInSelection;
        case SelectionState.leftClickInSelection:
          this.selectedElements = new Stack<SVGGElement>();
          this.selectedElements.push_back(this.clickedElement);
          break;
        case SelectionState.singleRightClick:
          this.selectedElements.contains(this.clickedElement) ?
            this.selectedElements.delete(this.clickedElement) : this.selectedElements.push_back(this.clickedElement);
          break;
      }
    } else if (this.state === SelectionState.leftClickInSelection || this.state === SelectionState.singleLeftClickOutOfSelection) {
      this.selectedElements = new Stack<SVGGElement>();
    }
    this.setGeneratedAreaBorders();
  }

  private invertSelection(): void {
    for (const element of this.elementsToInvert.getAll()) {
      this.selectedElements.contains(element) ? this.selectedElements.delete(element) : this.selectedElements.push_back(element);
    }
    this.elementsToInvert = new Stack<SVGGElement>();
  }

  private addOrInvertEachElementInRect(): void {
    const stack = new Stack<SVGGElement>();

    for (let i = 1; i < this.image.nativeElement.childNodes.length; i++) {
      const element = this.image.nativeElement.childNodes[i] as SVGGElement;
      if (element !== this.resizeGroup && element !== this.subElement) {
        const bBox = this.getBBoxWithStroke(element);
        if (!(bBox.left > this.selectionBox.right || this.selectionBox.left > bBox.right ||
            bBox.top > this.selectionBox.bottom || this.selectionBox.top > bBox.bottom)) {
            stack.push_back(element);
            }
      }
    }
    this.state === SelectionState.selecting ? this.selectedElements = stack : this.elementsToInvert = stack;
    this.setGeneratedAreaBorders();
  }

  selectAllElements(): void {
    this.onMouseRelease(new MouseEvent(''));
    this.cancelSelection();
    for (const element of [].slice.call(this.image.nativeElement.childNodes, 1)) {
      if (element !== this.subElement && element !== this.resizeGroup && element.tagName === 'g') {
        this.selectedElements.push_back(element);
      }
    }
    this.setGeneratedAreaBorders();
    this.transformShortcuts.setupShortcuts(this.manipulator, this.drawStack, this.image, this.resizeGroup);
  }

  private setGeneratedAreaBorders(): void {
    const selection = new Stack<SVGGElement>();
    for (const element of this.selectedElements.getAll()) {
      selection.push_back(element);
    }

    for (const element of this.elementsToInvert.getAll()) {
      selection.contains(element) ? selection.delete(element) : selection.push_back(element);
    }

    if (selection.getAll().length > 0) {
      const firstElement = this.getBBoxWithStroke(selection.getAll()[0]);
      let left = CoordinatesXY.effectiveX(this.image, firstElement.left);
      let right = CoordinatesXY.effectiveX(this.image, firstElement.right);
      let top = CoordinatesXY.effectiveY(this.image, firstElement.top);
      let bottom = CoordinatesXY.effectiveY(this.image, firstElement.bottom);

      for (let i = 1; i < selection.getAll().length; i++) {
        const boundingBox = this.getBBoxWithStroke(selection.getAll()[i]);
        left = Math.min(left, CoordinatesXY.effectiveX(this.image, boundingBox.left));
        right = Math.max(right, CoordinatesXY.effectiveX(this.image, boundingBox.right));
        top = Math.min(top, CoordinatesXY.effectiveY(this.image, boundingBox.top));
        bottom = Math.max(bottom, CoordinatesXY.effectiveY(this.image, boundingBox.bottom));
      }
      // Set origin and dimensions attributes for perimeter
      this.manipulator.setAttribute(this.selectionRect, SVGProperties.x, left.toString());
      this.manipulator.setAttribute(this.selectionRect, SVGProperties.y, top.toString());
      this.manipulator.setAttribute(this.selectionRect, SVGProperties.width, (right - left).toString());
      this.manipulator.setAttribute(this.selectionRect, SVGProperties.height, (bottom - top).toString());
      // Set control points positions : Top - Bottom - Left - Right
      let point = 0;
      this.manipulator.setAttribute(this.controlPoints[point], SVGProperties.x, ((right + left) / 2 - this.CONTROL_SIZE / 2).toString());
      this.manipulator.setAttribute(this.controlPoints[point++], SVGProperties.y, (top - this.CONTROL_SIZE / 2).toString());
      this.manipulator.setAttribute(this.controlPoints[point], SVGProperties.x, ((right + left) / 2 - this.CONTROL_SIZE / 2).toString());
      this.manipulator.setAttribute(this.controlPoints[point++], SVGProperties.y, (bottom - this.CONTROL_SIZE / 2).toString());
      this.manipulator.setAttribute(this.controlPoints[point], SVGProperties.x, (left - this.CONTROL_SIZE / 2).toString());
      this.manipulator.setAttribute(this.controlPoints[point++], SVGProperties.y, ((top + bottom) / 2 - this.CONTROL_SIZE / 2).toString());
      this.manipulator.setAttribute(this.controlPoints[point], SVGProperties.x, (right - this.CONTROL_SIZE / 2).toString());
      this.manipulator.setAttribute(this.controlPoints[point++], SVGProperties.y, ((top + bottom) / 2 - this.CONTROL_SIZE / 2).toString());
      this.manipulator.appendChild(this.image.nativeElement, this.resizeGroup);
      Transform.setElements(this.selectedElements, this.manipulator);
    } else {
      this.manipulator.removeChild(this.image.nativeElement, this.resizeGroup);
    }
  }

  private getBBoxWithStroke(element: SVGGElement): BoundingBox {
    const gElementBBox = element.getBoundingClientRect();
    const firstChild = element.firstChild as HTMLElement;
    const thickness = firstChild.getAttribute(SVGProperties.thickness);
    if (thickness !== null && (firstChild.tagName === 'path' || firstChild.tagName === 'polyline')) {
      const firstChildBBox = firstChild.getBoundingClientRect();
      return {
        left: Math.min(gElementBBox.left, firstChildBBox.left - parseInt(thickness, 10) / 2),
        right: Math.max(gElementBBox.right, firstChildBBox.right + parseInt(thickness, 10) / 2),
        top: Math.min(gElementBBox.top, firstChildBBox.top - parseInt(thickness, 10) / 2),
        bottom: Math.max(gElementBBox.bottom, firstChildBBox.bottom + parseInt(thickness, 10) / 2)
      };
    }
    return { left: gElementBBox.left, right: gElementBBox.right, top: gElementBBox.top, bottom: gElementBBox.bottom };
  }
}
