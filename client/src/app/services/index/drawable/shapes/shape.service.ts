import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { Color } from 'src/app/classes/color';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { ShapeStyle } from 'src/app/classes/shape-style';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { Tools } from 'src/app/enums/tools';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import { DrawableService } from '../drawable.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';

@Injectable({
  providedIn: 'root'
})
export abstract class ShapeService extends DrawableService {

  private readonly FIRST_QUADRANT: number = 1;
  private readonly SECOND_QUADRANT: number = 2;
  private readonly THIRD_QUADRANT: number = 3;
  private readonly FOURTH_QUADRANT: number = 4;

  attributes: DrawablePropertiesService;
  colorSelectorService: ColorSelectorService;
  shapeStyle: ShapeStyle;

  protected mousePosition: CoordinatesXY;
  protected shapeOrigin: CoordinatesXY;

  protected drawOnNextMove: boolean;
  protected isChanging: boolean;
  protected shiftPressed: boolean;
  protected mousePositionOnShiftPress: CoordinatesXY;

  protected text: SVGTextElement;
  protected perimeter: SVGRectElement;
  protected subElement: SVGGElement;
  protected shape: SVGElement;
  protected clip: SVGClipPathElement;
  protected use: SVGUseElement;

  protected svgHtmlTag: SVGProperties;
  protected svgTitle: Tools;

  constructor() {
    super();
  }

  initialize(manipulator: Renderer2, image: ElementRef, colorSelectorService: ColorSelectorService, drawStack: DrawStackService): void {
    this.assignParams(manipulator, image, colorSelectorService, drawStack);
    this.shiftPressed = false;
  }

  initializeProperties(): void {
    this.colorSelectorService.primaryColor.subscribe((color: Color) => {
      this.shapeStyle.fillColor = color;
    });

    this.colorSelectorService.secondaryColor.subscribe((color: Color) => {
      this.shapeStyle.borderColor = color;
    });

    this.colorSelectorService.primaryTransparency.subscribe((opacity: number) => {
      this.shapeStyle.fillOpacity = opacity;
    });

    this.colorSelectorService.secondaryTransparency.subscribe((opacity: number) => {
      this.shapeStyle.borderOpacity = opacity;
    });
  }

  updateTracingType(tracingType: 'border' | 'fill'): void {
    // Verify if a checkbox was changed while a rectangle creation was ongoing and dragged out of canvas
    this.cancelShapeIfOngoing();

    if (tracingType === 'border') {
      this.shapeStyle.hasBorder = !this.shapeStyle.hasBorder;
    } else {
      this.shapeStyle.hasFill = !this.shapeStyle.hasFill;
    }
  }

  cancelShapeIfOngoing(): void {
    if (this.isChanging) {
      this.manipulator.removeChild(this.image.nativeElement, this.subElement);
      this.isChanging = false;
    }
  }

  onMousePress(event: MouseEvent): void {
    if (this.isChanging) {
      // This case happens if the mouse button was released out of canvas: the shaped is confirmed on next mouse click
      this.onMouseRelease(event);
    } else if ((this.shapeStyle.hasBorder || this.shapeStyle.hasFill) && this.shapeStyle.thickness !== 0) {
      this.shapeOrigin = CoordinatesXY.getEffectiveCoords(this.image, event);
      this.drawOnNextMove = true;
    }

  }

  onMouseRelease(event?: MouseEvent): void {
    if (this.drawOnNextMove) {
      // Only a click was registered and no rectangle has been created after the mouse press
      this.drawOnNextMove = false;
    } else if (this.isChanging) {
      this.manipulator.removeChild(this.subElement, this.text); // Will be destroyed automatically when detached
      this.manipulator.removeChild(this.subElement, this.perimeter);
    }
    this.isChanging = false;
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isChanging) {
      this.mousePosition = CoordinatesXY.getEffectiveCoords(this.image, event); // Save mouse position for KeyPress Event
      this.updateSize();
    } else if (this.drawOnNextMove) {
      this.setupProperties();
      this.drawOnNextMove = false;
      this.isChanging = true;
    }
  }

  onKeyPressed(event: KeyboardEvent): void {
    if (event.shiftKey && !this.shiftPressed && this.isChanging) {
      this.shiftPressed = true;
      this.updateSize();
    }
  }
  onKeyReleased(event: KeyboardEvent): void {
    if (!event.shiftKey && this.shiftPressed) {
      this.shiftPressed = false;
      this.mousePosition = new CoordinatesXY(this.mousePositionOnShiftPress.getX(), this.mousePositionOnShiftPress.getY());
      if (this.isChanging) {
        this.updateSize();
      }
    }
  }

  endTool(): void {
    this.shiftPressed = false;
    if (this.drawOnNextMove) {
      this.manipulator.removeChild(this.image.nativeElement, this.subElement);
    }
  }

  protected updateSize(): void {
    let width = Math.abs(this.mousePosition.getX() - this.shapeOrigin.getX());
    let height = Math.abs(this.mousePosition.getY() - this.shapeOrigin.getY());

    if (this.shiftPressed) {
      this.mousePositionOnShiftPress = new CoordinatesXY(this.mousePosition.getX(), this.mousePosition.getY());
      const quadrant = this.mousePosition.getQuadrant(this.shapeOrigin);
      if (width > height) {
        if (quadrant === this.SECOND_QUADRANT || quadrant === this.THIRD_QUADRANT) {
          this.mousePosition.setX(this.mousePosition.getX() + (width - height)); // Faking mouse position
        }
        width = height;
      } else {
        if (quadrant === this.FIRST_QUADRANT || quadrant === this.SECOND_QUADRANT) {
          this.mousePosition.setY(this.mousePosition.getY() + (height - width)); // Faking mouse position
        }
        height = width;
      }
    }

    // Set dimensions attributes for perimeter
    this.manipulator.setAttribute(this.perimeter, SVGProperties.width, width.toString());
    this.manipulator.setAttribute(this.perimeter, SVGProperties.height, height.toString());

    // Set dimensions attributes for shape
    this.setDimensionsAttributes(width, height);
    this.alignShapeOrigin(width, height);
  }

  protected setupProperties(): void {
    // Creating elements
    const shapeID = this.drawStack.getNextID();
    this.subElement = this.manipulator.createElement('g', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.subElement, SVGProperties.title, shapeID.toString());
    this.shape = this.manipulator.createElement(this.svgHtmlTag, 'http://www.w3.org/2000/svg');
    this.text = this.manipulator.createElement('text', 'http://www.w3.org/2000/svg');
    this.perimeter = this.manipulator.createElement(SVGProperties.rectangle, 'http://www.w3.org/2000/svg');

    // Adding shape properties
    const thickness = this.shapeStyle.hasBorder ? (this.shapeStyle.thickness * 2).toString() : '0';
    this.manipulator.setAttribute(this.shape, SVGProperties.fill, this.shapeStyle.hasFill ? this.shapeStyle.fillColor.getHex() : 'none');
    this.manipulator.setAttribute(this.shape, SVGProperties.thickness, thickness);
    this.manipulator.setAttribute(this.shape, SVGProperties.color, this.shapeStyle.borderColor.getHex());
    this.manipulator.setAttribute(this.shape, SVGProperties.borderOpacity, this.shapeStyle.borderOpacity.toString());
    this.manipulator.setAttribute(this.shape, SVGProperties.fillOpacity, this.shapeStyle.fillOpacity.toString());
    this.manipulator.setAttribute(this.shape, 'id', `shape${shapeID}`);

    // Adding text properties
    const color = this.shapeStyle.hasFill ? this.shapeStyle.fillColor.getInvertedColor(true).getHex() : 'black';
    this.manipulator.setAttribute(this.text, SVGProperties.fill, color);
    this.manipulator.setAttribute(this.text, SVGProperties.thickness, '1');
    this.manipulator.setAttribute(this.text, SVGProperties.color, this.shapeStyle.hasFill ? 'none' : 'grey');
    this.manipulator.setAttribute(this.text, 'text-anchor', 'middle');

    // Adding perimeter properties
    const perimeterColor = this.colorSelectorService.backgroundColor.getValue().getInvertedColor(true);
    this.manipulator.setAttribute(this.perimeter, SVGProperties.fill, 'none');
    this.manipulator.setAttribute(this.perimeter, SVGProperties.color, perimeterColor.getHex());
    this.manipulator.setAttribute(this.perimeter, SVGProperties.thickness, '1');
    this.manipulator.setAttribute(this.perimeter, SVGProperties.dashedBorder, '4, 2');

    // Removing border outside of shape
    this.clip = this.manipulator.createElement('clipPath', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.clip, 'id', `clip${shapeID}`);
    this.use = this.manipulator.createElement('use', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.shape, 'clip-path', `url(#clip${shapeID})`);
    this.manipulator.setAttribute(this.use, 'href', `#shape${shapeID}`);

    // Adding elements to DOM
    this.manipulator.appendChild(this.subElement, this.shape);
    this.manipulator.appendChild(this.subElement, this.clip);
    this.manipulator.appendChild(this.clip, this.use);
    this.manipulator.appendChild(this.subElement, this.text);
    this.manipulator.appendChild(this.subElement, this.perimeter);
    this.manipulator.appendChild(this.image.nativeElement, this.subElement);

    // Allow undo/redo
    this.drawStack.addElementWithInfos({ target: this.subElement, id: shapeID });
  }

  protected alignShapeOrigin(width: number, height: number): void {
    const quadrant = this.mousePosition.getQuadrant(this.shapeOrigin);

    if (quadrant === this.FIRST_QUADRANT || quadrant === this.FOURTH_QUADRANT) {
      this.setShapeOriginFromRightQuadrants(width);
      this.manipulator.setAttribute(this.text, SVGProperties.x, (this.shapeOrigin.getX() + width / 2).toString());
      this.manipulator.setAttribute(this.perimeter, SVGProperties.x, this.shapeOrigin.getX().toString());
    } else {
      this.setShapeOriginFromLeftQuadrants(width);
      this.manipulator.setAttribute(this.text, SVGProperties.x, (this.mousePosition.getX() + width / 2).toString());
      this.manipulator.setAttribute(this.perimeter, SVGProperties.x, this.mousePosition.getX().toString());
    }

    if (quadrant === this.THIRD_QUADRANT || quadrant === this.FOURTH_QUADRANT) {
      this.setShapeOriginFromLowerQuadrants(height);
      this.manipulator.setAttribute(this.text, SVGProperties.y, (this.shapeOrigin.getY() + height / 2).toString());
      this.manipulator.setAttribute(this.perimeter, SVGProperties.y, this.shapeOrigin.getY().toString());
    } else {
      this.setShapeOriginFromUpperQuadrants(height);
      this.manipulator.setAttribute(this.text, SVGProperties.y, (this.mousePosition.getY() + height / 2).toString());
      this.manipulator.setAttribute(this.perimeter, SVGProperties.y, this.mousePosition.getY().toString());
    }

    this.updateTextSize(width, height);
  }

  protected updateTextSize(width: number, height: number): void {
    const minTextWidth = 40;
    const minTextHeight = 15;

    if (width > minTextWidth && height > minTextHeight) {
      this.text.innerHTML = this.shiftPressed ? this.shapeStyle.nameDisplayOnShift : this.shapeStyle.nameDisplayDefault;
    } else {
      this.text.innerHTML = '';
    }

    const fontSizeReductionFactor = 6;
    this.manipulator.setAttribute(this.text, 'font-size', (Math.min(height, width) / fontSizeReductionFactor).toString());
  }

  // Methods to implement in concrete shape class

  protected abstract setDimensionsAttributes(width: number, height: number): void;
  protected abstract setShapeOriginFromRightQuadrants(width: number): void;
  protected abstract setShapeOriginFromLeftQuadrants(width: number): void;
  protected abstract setShapeOriginFromLowerQuadrants(height: number): void;
  protected abstract setShapeOriginFromUpperQuadrants(height: number): void;
}
