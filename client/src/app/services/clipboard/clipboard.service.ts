import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Stack } from 'src/app/classes/stack';
import { Transform } from 'src/app/classes/transformations';
import { DrawStackService } from '../tools/draw-stack/draw-stack.service';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {
  static pastedElements: BehaviorSubject<SVGGElement[]> = new BehaviorSubject<SVGGElement[]>([]);
  private static readonly OFFSET_FOR_EACH: number = 5;

  private static manipulator: Renderer2;
  private static image: ElementRef<SVGElement>;
  private static drawStack: DrawStackService;

  private static selectedElements: Stack<SVGGElement> = new Stack<SVGGElement>();
  private static copyTop: number;
  private static copyLeft: number;
  private static shift: number;

  static initialize(manipulator: Renderer2, image: ElementRef<SVGElement>, drawStack: DrawStackService): void {
    ClipboardService.manipulator = manipulator;
    ClipboardService.image = image;
    ClipboardService.drawStack = drawStack;
  }

  static paste(): void {
    const pasteElements = new Stack<SVGGElement>();
    console.log(ClipboardService.selectedElements.getAll());

    for (const element of ClipboardService.selectedElements.getAll()) {
      const copy = element.cloneNode(true) as SVGGElement;
      ClipboardService.manipulator.appendChild(ClipboardService.image.nativeElement, copy);
      pasteElements.push_back(copy);
    }
    console.log(ClipboardService.image.nativeElement.getBoundingClientRect().bottom);
    console.log(ClipboardService.image.nativeElement.getBoundingClientRect().right);

    if (ClipboardService.copyTop + ClipboardService.OFFSET_FOR_EACH < ClipboardService.image.nativeElement.getBoundingClientRect().bottom &&
    ClipboardService.copyLeft + ClipboardService.OFFSET_FOR_EACH < ClipboardService.image.nativeElement.getBoundingClientRect().right) {
      if (ClipboardService.copyTop + ClipboardService.shift >= ClipboardService.image.nativeElement.getBoundingClientRect().bottom ||
      ClipboardService.copyLeft + ClipboardService.shift >= ClipboardService.image.nativeElement.getBoundingClientRect().right) {
        ClipboardService.shift = ClipboardService.OFFSET_FOR_EACH;
      }
      Transform.setElements(pasteElements, ClipboardService.manipulator);
      Transform.translate(ClipboardService.shift, ClipboardService.shift);
      ClipboardService.shift += ClipboardService.OFFSET_FOR_EACH;
      }
    ClipboardService.drawStack.addSVG(ClipboardService.image.nativeElement.cloneNode(true) as SVGElement);
    ClipboardService.pastedElements.next(pasteElements.getAll());
  }

  static copy(): void {
    ClipboardService.selectedElements.clear();
    let top: number = ClipboardService.image.nativeElement.getBoundingClientRect().bottom;
    let left: number = ClipboardService.image.nativeElement.getBoundingClientRect().right;
    for (const element of Transform.elementsToTransform) {
      ClipboardService.selectedElements.push_back(element);
      top = Math.min(top, element.getBoundingClientRect().top);
      left = Math.min(left, element.getBoundingClientRect().left);
    }
    ClipboardService.shift = ClipboardService.OFFSET_FOR_EACH;
    ClipboardService.copyTop = top;
    ClipboardService.copyLeft = left;
    console.log(left);

  }
}
