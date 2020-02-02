import { ElementRef, Injectable, Renderer2 } from '@angular/core';
//import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { DrawableService } from '../drawable.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { ShapeStyle } from 'src/app/classes/shape-style';
import { Coords } from 'src/app/classes/coordinates';
import { Color } from 'src/app/classes/color';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { invertColor } from 'src/app/classes/color-inverter';
import { Tools } from 'src/app/enums/tools';

@Injectable({
  providedIn: 'root'
})
export abstract class ShapeService extends DrawableService {

  attributes: DrawablePropertiesService;
  shapeStyle: ShapeStyle;

  protected mousePosition: Coords;
  protected shapeOrigin: Coords;

  protected isChanging: boolean;
  protected shiftPressed: boolean;
  protected mousePositionOnShiftPress: Coords;

  protected text: SVGTextElement;
  protected subElement: SVGGElement;
  protected shape: SVGElement;

  protected svgHtmlTag: SVGProperties;
  protected svgTitle: Tools;

  constructor() {
    super();
  }

  
  initialize(manipulator: Renderer2, image: ElementRef): void {
    this.assignParams(manipulator, image);
    this.shiftPressed = false;
  }

  initializeProperties(attributes: DrawablePropertiesService) {
    this.attributes = attributes;

    this.attributes.color.subscribe((element: string) => {
      this.shapeStyle.borderColor = new Color(element);
    });

    this.attributes.fillColor.subscribe((element: string) => {
      this.shapeStyle.fillColor = new Color(element);
    });
  }

  onMousePress(event: MouseEvent): void {
    if ((this.shapeStyle.hasBorder || this.shapeStyle.hasFill) && this.shapeStyle.thickness !== 0) {
      this.shapeOrigin = Coords.getEffectiveCoords(this.image, event);
      this.setupProperties();
      this.isChanging = true;
    }

  }

  onMouseRelease(event: MouseEvent): void {
    this.isChanging = false;
    this.manipulator.removeChild(this.subElement, this.text); // Will be destroyed automatically when detached
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isChanging) {
      this.mousePosition = Coords.getEffectiveCoords(this.image, event); // Save mouse position for KeyPress Event
      this.updateSize();
    }
  }

  onKeyPressed(event: KeyboardEvent): void {
    if(event.shiftKey && !this.shiftPressed && this.isChanging) {
      this.shiftPressed = true;
      this.updateSize();
    }
  }
  onKeyReleased(event: KeyboardEvent): void {
    if (!event.shiftKey && this.shiftPressed) {
      this.shiftPressed = false;
      this.mousePosition = new Coords(this.mousePositionOnShiftPress.x, this.mousePositionOnShiftPress.y);
      if (this.isChanging) {
        this.updateSize();
      }
    }
  }

  protected updateSize(): void {
    let width = Math.abs(this.mousePosition.x - this.shapeOrigin.x);
    let height = Math.abs(this.mousePosition.y - this.shapeOrigin.y);

    if (this.shiftPressed) {
      this.mousePositionOnShiftPress = new Coords(this.mousePosition.x, this.mousePosition.y);
      const quadrant = this.mousePosition.getQuadrant(this.shapeOrigin);
      if (width > height) {
        if (quadrant === 2 || quadrant === 3) {
          this.mousePosition.x = this.mousePosition.x + (width - height); // Faking mouse position
        }
        width = height;
      } else {
        if (quadrant === 1 || quadrant === 2) {
          this.mousePosition.y = this.mousePosition.y + (height - width); // Faking mouse position
        }
        height = width;
      }
    }

    this.setDimensionsAttributes(width, height);
    this.alignShapeOrigin(width, height);
  }

  protected setupProperties(): void {
    // Creating elements
    this.subElement = this.manipulator.createElement('g', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.subElement, SVGProperties.title, this.svgTitle);
    this.shape = this.manipulator.createElement(this.svgHtmlTag, 'http://www.w3.org/2000/svg');
    this.text = this.manipulator.createElement('text','http://www.w3.org/2000/svg');

    // Adding shape properties
    this.manipulator.setAttribute(this.shape, SVGProperties.fill, this.shapeStyle.hasFill ? this.shapeStyle.fillColor.getHex() : 'none');
    this.manipulator.setAttribute(this.shape, SVGProperties.thickness, this.shapeStyle.hasBorder ? this.shapeStyle.thickness.toString() : '0');
    this.manipulator.setAttribute(this.shape, SVGProperties.color, this.shapeStyle.borderColor.getHex());
    this.manipulator.setAttribute(this.shape, SVGProperties.opacity, this.shapeStyle.opacity);

    // Adding text properties
    this.manipulator.setAttribute(this.text, SVGProperties.fill, invertColor(this.shapeStyle.fillColor.getHex(), true));
    this.manipulator.setAttribute(this.text, 'text-anchor', 'middle');

    // Adding elements to DOM
    this.manipulator.appendChild(this.subElement, this.shape);
    this.manipulator.appendChild(this.subElement, this.text);
    this.manipulator.appendChild(this.image.nativeElement, this.subElement);
  }

  protected alignShapeOrigin(width: number, height: number) {
    let quadrant = this.mousePosition.getQuadrant(this.shapeOrigin);

    if (quadrant === 1 || quadrant === 4) {
      this.setShapeOriginFromRightQuadrants(width);
      this.manipulator.setAttribute(this.text, SVGProperties.x, (this.shapeOrigin.x + width / 2).toString());
    } else {
      this.setShapeOriginFromLeftQuadrants(width);
      this.manipulator.setAttribute(this.text, SVGProperties.x, (this.mousePosition.x + width / 2).toString());
    }

    if(quadrant === 3 || quadrant === 4) {
      this.setShapeOriginFromLowerQuadrants(height);
      this.manipulator.setAttribute(this.text, SVGProperties.y, (this.shapeOrigin.y + height / 2).toString());
    } else {
      this.setShapeOriginFromUpperQuadrants(height);
      this.manipulator.setAttribute(this.text, SVGProperties.y, (this.mousePosition.y + height / 2).toString());
    }

    this.updateTextSize(width, height);
  }

  protected updateTextSize(width: number, height: number) {
    const minTextWidth = 40;
    const minTextHeight = 15;

    if(width > minTextWidth && height > minTextHeight) {
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
