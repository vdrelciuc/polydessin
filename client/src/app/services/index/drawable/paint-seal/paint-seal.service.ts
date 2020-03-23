import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { DrawableService } from '../drawable.service';
import { BehaviorSubject } from 'rxjs';
import { VISUAL_DIFFERENCE } from 'src/app/classes/constants';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import { PipetteService } from 'src/app/services/pipette.service';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { Color } from 'src/app/classes/color';
import { CursorProperties } from 'src/app/classes/cursor-properties';
import { BFSAlgorithm } from 'src/app/classes/bfs-algorithm';
import { SVGProperties } from 'src/app/classes/svg-html-properties';

@Injectable({
  providedIn: 'root'
})
export class PaintSealService extends DrawableService {

  tolerance: BehaviorSubject<number>;
  private pipette: PipetteService;
  private canvas: HTMLCanvasElement;
  private context2D: CanvasRenderingContext2D;
  private SVGImg: HTMLImageElement;

  private bfsHelper: BFSAlgorithm;
  private currentMouseCoords: CoordinatesXY = new CoordinatesXY(0, 0);
  private svgWrap: SVGGElement;
  private fillColor: string;
  private mouseDown: boolean;

  constructor() {
    super();
    this.frenchName = 'Sceau de Peinture';
    this.tolerance = new BehaviorSubject<number>(VISUAL_DIFFERENCE);
  }

  initialize(
    manipulator: Renderer2,
    image: ElementRef<SVGElement>,
    colorSelectorService: ColorSelectorService,
    drawStack: DrawStackService
  ): void {
    this.assignParams(manipulator, image, colorSelectorService, drawStack);

    this.colorSelectorService.primaryColor.subscribe((fillColor: Color) => {
      this.fillColor = fillColor.getHex();
    });

    this.canvas = this.manipulator.createElement('canvas');
    this.SVGImg = this.manipulator.createElement('img');
    this.context2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  assignPipette(pipette: PipetteService): void {
    this.pipette = pipette;
  }

  onSelect(): void {
    this.pipette.getColorAtPosition(new CoordinatesXY(0, 0));
    this.manipulator.setAttribute(this.image.nativeElement, CursorProperties.cursor, CursorProperties.crosshair);
  }

  endTool(): void {
    this.manipulator.setAttribute(this.image.nativeElement, CursorProperties.cursor, CursorProperties.default);
  }

  onMousePress(event: MouseEvent): void {
    this.updateCanvas();
    this.mouseDown = true;
  }

  onMouseRelease(event: MouseEvent): void {
    if (!this.mouseDown) {
      return;
    }
    this.updateCanvas();
    this.updateMousePosition(event);

    this.createBFSHelper();
    this.bfsHelper.computeBFS(this.currentMouseCoords);

    this.fill();
    this.mouseDown = false;
  }

  private createBFSHelper(): void {
    this.bfsHelper = new BFSAlgorithm(
      this.canvas.width,
      this.canvas.height,
      this.context2D,
      this.tolerance.value
    );
  }

  private updateMousePosition(event: MouseEvent): void {
    this.currentMouseCoords.setX(event.clientX - this.image.nativeElement.getBoundingClientRect().left);
    this.currentMouseCoords.setY(event.clientY - this.image.nativeElement.getBoundingClientRect().top);
  }

  private fill(): void {
    this.createSVGWrapper();
    const d: string = this.createFillPath();
    this.fillBody(d);
    this.manipulator.appendChild(this.image.nativeElement, this.svgWrap);
  }

  private fillBody(d: string): SVGGElement {
    const bodyWrap: SVGGElement = this.manipulator.createElement('g', SVGProperties.nameSpace);
    this.manipulator.setAttribute(bodyWrap, SVGProperties.fill, this.fillColor);
    this.manipulator.setAttribute(bodyWrap, SVGProperties.color, this.fillColor);
    this.manipulator.setAttribute(bodyWrap, SVGProperties.thickness, '1');
    this.manipulator.setAttribute(bodyWrap, SVGProperties.title, 'body');

    const path: SVGPathElement = this.manipulator.createElement('path', SVGProperties.nameSpace);
    this.manipulator.setAttribute(path, 'd', d);
    this.manipulator.setAttribute(path, 'fill-rule', 'evenodd');
    this.manipulator.setAttribute(path, SVGProperties.joint, 'round');
    this.manipulator.setAttribute(path, SVGProperties.endOfLine, 'round');

    this.manipulator.appendChild(bodyWrap, path);
    this.manipulator.appendChild(this.svgWrap, bodyWrap);
    return bodyWrap;
  }

  private createFillPath(): string {
    let d = '';
    this.bfsHelper.pathsToFill.forEach((el) => {
      el.forEach((pixel: CoordinatesXY, i: number) => {
        d += i === 0 ? ` M${pixel.getX() + 0.5} ${pixel.getY() + 0.5}` : ` L${pixel.getX() + 0.5} ${pixel.getY() + 0.5}`;
      });
      d += ' z';
    });
    return d;
  }

  private updateCanvas(): void {
    const serializedSVG = new XMLSerializer().serializeToString(this.image.nativeElement);
    this.manipulator.setProperty(this.SVGImg, 'src', 'data:image/svg+xml,' + encodeURIComponent(serializedSVG));
    this.manipulator.setProperty(
      this.canvas,
      SVGProperties.width,
      this.image.nativeElement.getBoundingClientRect().width,
    );
    this.manipulator.setProperty(
      this.canvas,
      SVGProperties.height,
      this.image.nativeElement.getBoundingClientRect().height,
    );
    this.context2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.context2D.drawImage(this.SVGImg, 0, 0);
  }

  private createSVGWrapper(): void {
    const wrap: SVGGElement = this.manipulator.createElement('g', SVGProperties.nameSpace);
    this.manipulator.setAttribute(wrap, SVGProperties.title, 'fill');
    this.svgWrap = wrap;
  }
}