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
  private algorithm: BFSAlgorithm;
  private fillColor: Color;
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
      this.fillColor = fillColor;
    });
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
    this.mouseDown = true;
  }

  onClick(event: MouseEvent): void {
    if(this.mouseDown) {
      this.algorithm = new BFSAlgorithm(
        this.image.nativeElement.scrollWidth,
        this.image.nativeElement.scrollHeight,
        this.pipette.hiddenCanvas.getContext('2d') as CanvasRenderingContext2D,
        this.tolerance.value
      );
      this.algorithm.BFS(CoordinatesXY.getEffectiveCoords(this.image, event));

      const pathDefinition = this.generatePathDefinition();
      this.draw(pathDefinition);

      this.mouseDown = false;
      this.pushElement();
    }
  }

  private draw(d: string): void {
    this.subElement = this.manipulator.createElement('g', SVGProperties.nameSpace);
    this.manipulator.setAttribute(this.subElement, SVGProperties.fill, this.fillColor.getHex());
    this.manipulator.setAttribute(this.subElement, SVGProperties.color, 'none');
    this.manipulator.setAttribute(this.subElement, SVGProperties.thickness, '1');

    const path: SVGPathElement = this.manipulator.createElement(SVGProperties.path, SVGProperties.nameSpace);
    this.manipulator.setAttribute(path, SVGProperties.d, d);
    this.manipulator.setAttribute(path, 'fill-rule', 'evenodd');
    this.manipulator.setAttribute(path, SVGProperties.joint, 'round');
    this.manipulator.setAttribute(path, SVGProperties.endOfLine, 'round');
    this.manipulator.appendChild(this.subElement, path);
    this.manipulator.appendChild(this.image.nativeElement, this.subElement);
  }

  private generatePathDefinition(): string {
    let pathDefinition = '';
    if(this.algorithm.pathsToFill !== undefined) {
      this.algorithm.pathsToFill.forEach((array) => {
        array.forEach((pixel: CoordinatesXY, i: number) => {
          if(i === 0) {
            pathDefinition += ` M${pixel.getX() + 0.5} ${pixel.getY() + 0.5}`;
          } else {
            pathDefinition += ` L${pixel.getX() + 0.5} ${pixel.getY() + 0.5}`;
          }
        });
        pathDefinition += ' z';
      });
    }
    return pathDefinition;
  }
}