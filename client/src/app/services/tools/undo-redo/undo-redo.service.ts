import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { DrawStackService } from '../draw-stack/draw-stack.service';
import { SVGElementInfos } from 'src/app/interfaces/svg-element-infos';
import { Stack } from 'src/app/classes/stack';

@Injectable({
  providedIn: 'root'
})
export class UndoRedoService {

  private removed: Stack<SVGElementInfos>;

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
    const toRedo = this.removed.pop_back();
    if(toRedo !== undefined) {
      this.drawStack.addElementWithInfos(toRedo);
      this.manipulator.appendChild(this.image.nativeElement, toRedo.target);
    }
  }

  canRedo(): boolean {
    return this.removed.getAll().length > 0;
  }
}
