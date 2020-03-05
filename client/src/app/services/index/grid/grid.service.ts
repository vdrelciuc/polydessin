import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { BehaviorSubject } from 'rxjs';
import { DrawableService } from '../drawable/drawable.service';
import * as CONSTANT from 'src/app/classes/constants';
import { ColorSelectorService } from '../../color-selector.service';
import { DrawStackService } from '../../tools/draw-stack/draw-stack.service';

@Injectable({
  providedIn: 'root'
})
export class GridService extends DrawableService{

  thickness: BehaviorSubject<number>;
  opacity: BehaviorSubject<number>;
  private visible: boolean;
  private grid: ElementRef<SVGGElement>;
  private state: Map<boolean, string>;
  private patern: SVGPatternElement | null;

  constructor() { 
    super();
    this.state = new Map<boolean, string>();
    this.state.set(true, 'visible');
    this.state.set(false, 'hidden');
    this.thickness = new BehaviorSubject<number>(CONSTANT.GRID_MINIMUM);
    this.opacity = new BehaviorSubject<number>(CONSTANT.OPACITY_DEFAULT);
  }

  initializeGrid(grid: ElementRef<SVGGElement>): void {
    this.grid = grid;
    this.patern = grid.nativeElement.querySelector('#grid-pattern');
    this.thickness.subscribe( () => {
      if(this.patern !== null) {
        this.manipulator.setAttribute(this.grid.nativeElement, SVGProperties.width, this.thickness.value.toString());
      }
    });
  }

  initialize(manipulator: Renderer2, image: ElementRef<SVGElement>, colorSelectorService: ColorSelectorService, drawStack: DrawStackService): void {
    this.assignParams(manipulator, image, colorSelectorService, drawStack);
  }

  toggle(): void {
    this.visible = !this.visible;
    const visibility = this.state.get(this.visible);
    if(visibility !== undefined) {
      this.grid.nativeElement.setAttribute(SVGProperties.visibility, visibility);
    }
  }
}
