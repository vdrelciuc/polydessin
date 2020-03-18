import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Stack } from 'src/app/classes/stack';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { Transform } from 'src/app/classes/transformations';
import { DrawStackService } from '../tools/draw-stack/draw-stack.service';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {
  static pastedElements: BehaviorSubject<SVGGElement[]> = new BehaviorSubject<SVGGElement[]>([]);
  private static readonly TRANSLATE_BETWEEN_EACH: number = 5;

  private static manipulator: Renderer2;
  private static image: ElementRef<SVGElement>;
  private static drawStack: DrawStackService;

  private static selectedElements: Stack<SVGGElement> = new Stack<SVGGElement>();
  private static selectedTop: number;
  private static selectedLeft: number;
  private static currentTranslate: number;

  static initialize(manipulator: Renderer2, image: ElementRef<SVGElement>, drawStack: DrawStackService): void {
    ClipboardService.manipulator = manipulator;
    ClipboardService.image = image;
    ClipboardService.drawStack = drawStack;
  }

  static paste(): void {
    for (const element of ClipboardService.selectedElements.getAll()) {
      console.log(ClipboardService.drawStack.getNextID());

      const copy = element.cloneNode(true) as SVGGElement;
      //ClipboardService.image.nativeElement.appendChild(copy);
      ClipboardService.manipulator.appendChild(ClipboardService.image.nativeElement, copy);/*
      ClipboardService.drawStack.addElementWithInfos({
        target: copy,
        id: ClipboardService.drawStack.getNextID()
      });
      this.manipulator.setAttribute(element, SVGProperties.title, ClipboardService.drawStack.getNextID().toString());*/
    }
    if (ClipboardService.selectedTop + ClipboardService.TRANSLATE_BETWEEN_EACH < ClipboardService.image.nativeElement.clientHeight &&
      ClipboardService.selectedLeft + ClipboardService.TRANSLATE_BETWEEN_EACH < ClipboardService.image.nativeElement.clientWidth) {
        if (ClipboardService.selectedTop + ClipboardService.currentTranslate >= ClipboardService.image.nativeElement.clientHeight ||
          ClipboardService.selectedLeft + ClipboardService.currentTranslate >= ClipboardService.image.nativeElement.clientWidth) {
            ClipboardService.currentTranslate = ClipboardService.TRANSLATE_BETWEEN_EACH;
          }
        Transform.setElements(ClipboardService.selectedElements, ClipboardService.manipulator);
        Transform.translate(ClipboardService.currentTranslate, ClipboardService.currentTranslate);
        ClipboardService.currentTranslate += ClipboardService.TRANSLATE_BETWEEN_EACH;
      }
    ClipboardService.drawStack.addSVG(ClipboardService.image.nativeElement.cloneNode(true) as SVGElement);
  }

  static copy(): void {
    ClipboardService.selectedElements.clear();
    let top: number = ClipboardService.image.nativeElement.clientHeight;
    let left: number = ClipboardService.image.nativeElement.clientWidth;
    for (const element of Transform.elementsToTransform) {
      ClipboardService.selectedElements.push_back(element);
      top = Math.min(top, element.clientTop);
      left = Math.min(left, element.clientLeft);
    }
    ClipboardService.currentTranslate = ClipboardService.TRANSLATE_BETWEEN_EACH;
    ClipboardService.selectedTop = top;
    ClipboardService.selectedLeft = left;
  }
}
