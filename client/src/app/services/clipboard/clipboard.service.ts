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
  private static readonly INCREMENT_BETWEEN: number = 5;

  private static manipulator: Renderer2;
  private static image: ElementRef<SVGElement>;
  private static drawStack: DrawStackService;

  private static selectedElements: Stack<SVGGElement> = new Stack<SVGGElement>();
  private static copyTop: number;
  private static copyLeft: number;
  private static currentShift: number;

  static initialize(manipulator: Renderer2, image: ElementRef<SVGElement>, drawStack: DrawStackService): void {
    ClipboardService.manipulator = manipulator;
    ClipboardService.image = image;
    ClipboardService.drawStack = drawStack;
  }

  static paste(): void {
    const pasteElements = new Stack<SVGGElement>();
    for (const element of ClipboardService.selectedElements.getAll()) {
      const copy = element.cloneNode(true) as SVGGElement;
      ClipboardService.manipulator.appendChild(ClipboardService.image.nativeElement, copy);
      pasteElements.push_back(copy);
    }
    const imageWidth = ClipboardService.image.nativeElement.getBoundingClientRect().right;
    const imageHeight = ClipboardService.image.nativeElement.getBoundingClientRect().bottom;
    if (ClipboardService.copyTop + ClipboardService.INCREMENT_BETWEEN < imageHeight &&
    ClipboardService.copyLeft + ClipboardService.INCREMENT_BETWEEN < imageWidth) {
      if (ClipboardService.copyTop + ClipboardService.currentShift >= imageHeight ||
      ClipboardService.copyLeft + ClipboardService.currentShift >= imageWidth) {
        ClipboardService.currentShift = ClipboardService.INCREMENT_BETWEEN;
      }
      Transform.setElements(pasteElements, ClipboardService.manipulator);
      Transform.translate(ClipboardService.currentShift, ClipboardService.currentShift);
      ClipboardService.currentShift += ClipboardService.INCREMENT_BETWEEN;
      }
    ClipboardService.drawStack.addSVG(ClipboardService.image.nativeElement.cloneNode(true) as SVGElement);
    ClipboardService.pastedElements.next(pasteElements.getAll());
  }

  static copy(): void {
    ClipboardService.selectedElements.clear();
    let top: number = ClipboardService.image.nativeElement.getBoundingClientRect().bottom;
    let left: number = ClipboardService.image.nativeElement.getBoundingClientRect().right;
    for (const element of Transform.elementsToTransform) {
      ClipboardService.selectedElements.push_back(element.cloneNode(true) as SVGGElement);
      top = Math.min(top, element.getBoundingClientRect().top);
      left = Math.min(left, element.getBoundingClientRect().left);
    }
    ClipboardService.currentShift = ClipboardService.INCREMENT_BETWEEN;
    ClipboardService.copyTop = top;
    ClipboardService.copyLeft = left;
  }

  static cut(): void {
    ClipboardService.copy();
    Transform.delete();
    ClipboardService.drawStack.addSVG(ClipboardService.image.nativeElement.cloneNode(true) as SVGElement);
  }

  static duplicate(): void {
    const duplicateElements = new Stack<SVGGElement>();
    let top: number = ClipboardService.image.nativeElement.getBoundingClientRect().bottom;
    let left: number = ClipboardService.image.nativeElement.getBoundingClientRect().right;
    for (const element of Transform.elementsToTransform) {
      const copy = element.cloneNode(true) as SVGGElement;
      ClipboardService.manipulator.appendChild(ClipboardService.image.nativeElement, copy);
      top = Math.min(top, element.getBoundingClientRect().top);
      left = Math.min(left, element.getBoundingClientRect().left);
      duplicateElements.push_back(copy);
    }
    Transform.setElements(duplicateElements, ClipboardService.manipulator);
    const imageWidth = ClipboardService.image.nativeElement.getBoundingClientRect().right;
    const imageHeight = ClipboardService.image.nativeElement.getBoundingClientRect().bottom;
    Transform.translate(
      (left + ClipboardService.INCREMENT_BETWEEN < imageWidth) ?
      ClipboardService.INCREMENT_BETWEEN : ClipboardService.INCREMENT_BETWEEN - imageWidth,
      (top + ClipboardService.INCREMENT_BETWEEN < imageHeight) ?
      ClipboardService.INCREMENT_BETWEEN : ClipboardService.INCREMENT_BETWEEN - imageHeight
    );
    ClipboardService.drawStack.addSVG(ClipboardService.image.nativeElement.cloneNode(true) as SVGElement);
    ClipboardService.pastedElements.next(duplicateElements.getAll());
  }
}
