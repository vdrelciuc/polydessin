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

  constructor(
    private drawStack: DrawStackService,
    private manipulator: Renderer2,
    private image: ElementRef<SVGElement>) { 
      this.removed = new Stack<SVGElementInfos>();
      this.drawStack.isAdding.subscribe(
        () => {
          if(this.drawStack.isAdding.value) {
            this.removed = new Stack<SVGElementInfos>();
          }
        }
      );
      this.drawStack.changeAt.subscribe(
        () => {
          const changeValue = this.drawStack.changeAt.value;
          if(changeValue !== 0) {
            this.redrawStackFrom(changeValue);
          }
        }
      )
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
    if(this.toRedo !== undefined) {
      this.drawStack.addElementWithInfos(this.toRedo);
      this.manipulator.appendChild(this.image.nativeElement, this.toRedo.target);
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
    console.log('in redraw');
    if(this.toRedo !== undefined) {
      let toRedraw = this.drawStack.removeElements(from);
      console.log('to redraw');
      console.log(toRedraw);
      for(const element of toRedraw) {
        this.manipulator.removeChild(this.image.nativeElement, element.target);
      }
      toRedraw[toRedraw.length] = this.toRedo;
      for(const element of toRedraw) {
        this.manipulator.appendChild(this.image.nativeElement, element.target);
      }
    }
  }
}
