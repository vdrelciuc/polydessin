import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { Stack } from 'src/app/classes/stack';
import { DrawStackService } from '../tools/draw-stack/draw-stack.service';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {
  private readonly TRANSLATE_BETWEEN_EACH: number = 5;

  private manipulator: Renderer2;
  private image: ElementRef<SVGElement>;
  private drawStack: DrawStackService;

  private selectedElements: Stack<SVGGElement>;
  private currentTranslate: number;

  constructor() {
    this.selectedElements = new Stack<SVGGElement>();
    this.currentTranslate = this.TRANSLATE_BETWEEN_EACH;
  }

  initialize(manipulator: Renderer2, image: ElementRef<SVGElement>, drawStack: DrawStackService): void {
    this.manipulator = manipulator;
    this.image = image;
    this.drawStack = drawStack;
  }

  paste(): void {
    for (const element of this.selectedElements.getAll()) {
      const copy = element.cloneNode(true) as SVGGElement;
      this.image.nativeElement.appendChild(copy);
      this.drawStack.addElementWithInfos({
        target: copy,
        id: this.drawStack.getNextID()
      });
    }
    this.drawStack.addSVG(this.image.nativeElement);
    this.currentTranslate += this.TRANSLATE_BETWEEN_EACH;
  }

  copy(selectedElements: SVGGElement[]): void {
    this.selectedElements.clear();
    for (const element of selectedElements) {
      this.selectedElements.push_back(element);
    }
    this.currentTranslate = this.TRANSLATE_BETWEEN_EACH;
  }
}
