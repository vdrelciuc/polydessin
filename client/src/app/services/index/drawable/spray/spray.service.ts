import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { Color } from 'src/app/classes/color';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawableService } from '../drawable.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import { BehaviorSubject } from 'rxjs';
import * as CONSTANTS from 'src/app/classes/constants';

@Injectable({
  providedIn: 'root'
})
export class SprayService extends DrawableService {
  private readonly DOT_RADIUS: number = 1;
  private readonly DEFAULT_RADIUS: number = 5;
  private readonly DEFAULT_FREQUENCY: number = 4;
  private color: Color;
  private opacity: number;
  radius: number;
  frequency: number;
  private isDrawing: BehaviorSubject<boolean>;
  colorSelectorService: ColorSelectorService;

  constructor() {
    super();
    this.frenchName = 'Aérosol';
    this.isDrawing = new BehaviorSubject<boolean>(false);
    this.radius = this.DEFAULT_RADIUS;
    this.frequency = this.DEFAULT_FREQUENCY;
  }

  initialize(
    manipulator: Renderer2,
    image: ElementRef<SVGElement>,
    colorSelectorService: ColorSelectorService,
    drawStack: DrawStackService): void {
      this.assignParams(manipulator, image, colorSelectorService, drawStack);
      this.initializeProperties();
      this.isDrawing.subscribe(
        () => {
        if(!this.isDrawing.value && this.subElement !== undefined) {
          this.pushElement();
        }
      }
      )
    }

    initializeProperties(): void {

      this.colorSelectorService.primaryColor.subscribe((color: Color) => {
        this.color = color;
      });

      this.colorSelectorService.primaryTransparency.subscribe((opacity: number) => {
        this.opacity = opacity;
      });

    }

  onMouseInCanvas(event: MouseEvent): void {

  }
  onMouseOutCanvas(event: MouseEvent): void {
    if (this.isDrawing.value) {
      this.isDrawing.next(false);
    }
  }
  onMousePress(event: MouseEvent): void {
    this.isDrawing.next(true);
    this.beginDraw(event.clientX, event.clientY);
    this.subElement = this.manipulator.createElement('g', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.subElement, SVGProperties.title, 'spray');

    this.manipulator.appendChild(this.image.nativeElement, this.subElement);

  }
  onMouseRelease(event: MouseEvent): void {
    if (event.button === CONSTANTS.MOUSE_LEFT) { // 0 for the left mouse button
      if (this.isDrawing.value) {
        this.isDrawing.next(false);
      }
    }
  }
  onMouseMove(event: MouseEvent): void {
    if (this.isDrawing.value) {
    }
  }

  endTool(): void {
    if(this.isDrawing.value) {
      this.manipulator.removeChild(this.image.nativeElement, this.subElement);
    }
    delete(this.subElement);
    this.isDrawing.next(false);
  }

  private beginDraw(clientX: number, clientY: number) {
  }

}
