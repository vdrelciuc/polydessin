import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { DrawStackService } from '../draw-stack/draw-stack.service';
import { SVGElementInfos } from 'src/app/interfaces/svg-element-infos';
import { Stack } from 'src/app/classes/stack';

@Injectable({
  providedIn: 'root'
})
export class UndoRedoService {

  private removed: Stack<SVGElementInfos>;
  private toRedo: SVGElementInfos | undefined;
  private toRedraw: Stack<SVGElementInfos>;
  private redoing: boolean;

  constructor(
    private drawStack: DrawStackService,
    private manipulator: Renderer2,
    private image: ElementRef<SVGElement>) { 
      this.redoing = false;
      this.removed = new Stack<SVGElementInfos>();
      this.drawStack.isAdding.subscribe(
        () => {
          if(this.drawStack.isAdding.value && !this.redoing) {
            this.removed = new Stack<SVGElementInfos>();
          }
        }
      );
      this.drawStack.changeAt.subscribe(
        () => {
          const changeValue = this.drawStack.changeAt.value;
          if(changeValue !== -1) {
            this.redrawStackFrom(changeValue);
          }
        }
      );
      this.toRedraw = new Stack<SVGElementInfos>();
    }

  undo(): void {
    const toUndo = this.drawStack.removeLastElement();
    if(toUndo !== undefined) {
      this.removed.push_back(toUndo);
      this.manipulator.removeChild(this.image, toUndo.target);
    }
  }

  canUndo(): boolean {
    return !this.drawStack.isEmpty();
  }

  redo(): void{
    this.toRedo = this.removed.pop_back();
    this.redoing = true;
    if(this.toRedo !== undefined) {
      this.redoing = true;
      this.drawStack.addElementWithInfos(this.toRedo);
      this.manipulator.appendChild(this.image.nativeElement, this.toRedo.target);
      this.redoing = false;
    }
    if(this.toRedraw.getAll().length > 0) {
      this.redrawStack();
    }
  }

  canRedo(): boolean {
    return this.removed.getAll().length > 0;
  }

  addToRemoved(toUndo: SVGElementInfos): void {
    this.removed.push_back(toUndo);
    this.manipulator.removeChild(this.image.nativeElement, toUndo.target);
  }

  private redrawStackFrom(from: number): void {
    this.toRedraw = this.drawStack.removeElements(from);
    if(this.toRedo !== undefined) {
      for(const elementToRedraw of this.toRedraw.getAll()) {
        this.manipulator.removeChild(this.image.nativeElement, elementToRedraw.target);
      }
    }
  }

  private redrawStack(): void {
    if(this.toRedraw.getAll().length !== 0) {
      let elementToRedraw = this.toRedraw.pop_front();
      while(elementToRedraw !== undefined) {
        this.manipulator.appendChild(this.image.nativeElement, elementToRedraw.target);
        this.drawStack.addFromUndo(elementToRedraw);
        elementToRedraw = this.toRedraw.pop_front();
      }
    }
  }
}
