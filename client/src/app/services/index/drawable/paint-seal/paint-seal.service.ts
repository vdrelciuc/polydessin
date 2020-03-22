import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { DrawableService } from '../drawable.service';
import { BehaviorSubject } from 'rxjs';
import { VISUAL_DIFFERENCE} from 'src/app/classes/constants';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';

@Injectable({
  providedIn: 'root'
})
export class PaintSealService extends DrawableService {

  tolerance: BehaviorSubject<number>;
  minimumColor: string;
  maximumColor: string;
  elements: SVGGElement[];

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
  }

  onSelect(): void {
    this.elements = Array.from(this.image.nativeElement.querySelectorAll('g'));
  }

  onClick(event: MouseEvent): void {
    const currentSVG = event.target as SVGGElement;
    this.findAllInBounds(currentSVG.getBoundingClientRect() as DOMRect);
  }


  private findAllInBounds(elementInBounds: DOMRect): SVGGElement[] {
    let ret: SVGGElement[] = new Array();
    for(const element of this.elements) {
      if(this.getInBounds(element.getBoundingClientRect() as DOMRect, elementInBounds)) {
        ret[ret.length - 1] = element;
      }
    }
    return ret;
  }

  private getInBounds(elementBounds: DOMRect, reference: DOMRect): boolean {
    console.log('Reference ' + reference.left + ' ' + reference.right + ' ' + reference.top + ' ' + reference.bottom);
    console.log('Elemenet  ' + elementBounds.left + ' ' + elementBounds.right + ' ' + elementBounds.top + ' ' + elementBounds.bottom);


    return (
        elementBounds.left   < reference.left   ||
        elementBounds.right  > reference.right  ||
        elementBounds.top    < reference.top    ||
        elementBounds.bottom > reference.bottom       
    );
  }

  // private computeMinAndMax(): void {
  //   const primaryColor = this.colorSelectorService.primaryColor.value;
  
  // }
}
