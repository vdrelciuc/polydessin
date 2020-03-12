import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { Color } from 'src/app/classes/color';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawableService } from '../drawable.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SprayService extends DrawableService {
  private readonly DOT_RADIUS: number = 1;
  private readonly DOTS_PER_SPRAY: number = 20;
  private readonly DEFAULT_RADIUS: number = 5;
  private readonly DEFAULT_FREQUENCY: number = 4;
  private readonly MS_PER_S: number = 1000;
  private spraying: boolean = false;
  private color: Color;
  private opacity: number;
  private mousePosition: CoordinatesXY;
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

  onMouseOutCanvas(event: MouseEvent): void {
    if (this.isDrawing.value) {
      this.isDrawing.next(false);
    }
  }
  onMousePress(event: MouseEvent): void {
    this.isDrawing.next(true);
    this.subElement = this.manipulator.createElement('g', 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(this.subElement, SVGProperties.title, 'spray');

    this.manipulator.appendChild(this.image.nativeElement, this.subElement);
    if (!this.spraying) {
      this.spraying = true;
      this.Spray();
    }

  }
  onMouseRelease(event: MouseEvent): void {
    if (this.isDrawing.value) {
      this.isDrawing.next(false);
    }
  }
  onMouseMove(event: MouseEvent): void {
    this.mousePosition = CoordinatesXY.getEffectiveCoords(this.image, event);
  }

  endTool(): void {
    if(this.isDrawing.value) {
      this.manipulator.removeChild(this.image.nativeElement, this.subElement);
    }
    delete(this.subElement);
    this.isDrawing.next(false);
  }

  private printSpray(): void {
    for (let i = 0; i < this.DOTS_PER_SPRAY; i++) {
      const radius = this.radius * this.generateRandom();
      const angle = 2 * Math.PI * this.generateRandom();
      this.createDot(this.mousePosition.getX() + radius * Math.cos(angle), this.mousePosition.getY() + radius * Math.sin(angle));
    }
  }
  private generateRandom(): number {
    return Math.random();
  }
  private createDot(x: number, y: number): void {
    const dot = this.manipulator.createElement(SVGProperties.circle, 'http://www.w3.org/2000/svg');
    this.manipulator.setAttribute(dot, SVGProperties.fill, this.color.getHex());
    this.manipulator.setAttribute(dot, SVGProperties.globalOpacity, this.opacity.toString());
    this.manipulator.setAttribute(dot, SVGProperties.radius, (this.DOT_RADIUS / 2).toString());
    this.manipulator.setAttribute(dot, SVGProperties.centerX, x.toString());
    this.manipulator.setAttribute(dot, SVGProperties.centerY, y.toString());
    this.manipulator.appendChild(this.subElement, dot);
  }

  private async Spray(): Promise<void> {
    if (this.isDrawing.value) {
      this.printSpray();
      setTimeout(() => this.Spray(), this.MS_PER_S / this.frequency);
    } else {
      this.spraying = false;
    }
  }
}
