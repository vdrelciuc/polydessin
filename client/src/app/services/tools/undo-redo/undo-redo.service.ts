import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { DrawStackService } from '../draw-stack/draw-stack.service';
import { Stack } from 'src/app/classes/stack';
import { BehaviorSubject } from 'rxjs';
import { SVGProperties } from 'src/app/classes/svg-html-properties';

@Injectable({
  providedIn: 'root'
})
export class UndoRedoService {

  private removed: Stack<SVGElement>;
  private elements: Stack<SVGElement>;
  private currentSVG: SVGElement;
  changed: BehaviorSubject<boolean>;

  constructor(
    private drawStack: DrawStackService,
    private manipulator: Renderer2,
    private image: ElementRef<SVGElement>) { 
      this.changed = new BehaviorSubject<boolean>(false);
      this.removed = new Stack<SVGElement>();
      this.elements = new Stack<SVGElement>();
      this.setCurrent(this.image.nativeElement.cloneNode(true) as SVGElement);
      this.drawStack.addedSVG.subscribe(
        () => {
          const svg = this.drawStack.addedSVG.value;
          if(svg !== undefined) {
            this.setCurrent(svg);
            this.drawStack.addedSVG.next(undefined);
          }
        }
      );
      this.drawStack.addedToRedo.subscribe(
        () => {
          // const svg = this.drawStack.addedToRedo.value;
          // if(svg !== undefined) {
          const svg = this.drawStack.addedToRedo.value;
          if(svg !== undefined) {
            this.removed.push_back(this.currentSVG);
            this.currentSVG = svg;
            this.drawStack.addedToRedo.next(undefined);
          }
          // }
        }
      );
      this.drawStack.reset.subscribe(
        () => {
          if(this.drawStack.reset.value) {
            this.removed.clear();
            this.drawStack.reset.next(false);
          }
        }
      );
      this.drawStack.newSVG.subscribe(
        () => {
          if(this.drawStack.newSVG.value) {
            this.clear();
            this.drawStack.newSVG.next(false);
          }
        }
      );
  }

  undo(): void {
    const toUndo = this.elements.pop_back();
    if(toUndo !== undefined) {
      if(this.currentSVG.childElementCount > 1) {
        this.removed.push_back(this.currentSVG);
      }
      this.currentSVG = toUndo;
      if(this.isEmpty()) {
        this.addElement(toUndo);
      }
      this.replace(toUndo);
      this.changed.next(true);
    }
  }

  canUndo(): boolean {
    return !this.isEmpty();
  }

  redo(): void{
    const toRedo = this.removed.pop_back();
    if(toRedo !== undefined) {
      this.setCurrent(toRedo);
      this.replace(toRedo);
      this.changed.next(true);
    }
  }

  canRedo(): boolean {
    return this.removed.getAll().length > 0;
  }

  clear(): void {
    this.setCurrent(this.image.nativeElement.cloneNode(true) as SVGElement);
    this.elements.clear();
    this.removed.clear();
  }

  private replace(by: SVGElement): void {
    let children = this.image.nativeElement.childNodes;
    children.forEach(
      (child) => {
        this.drawStack.removeElement( Number((child as SVGGElement).getAttribute(SVGProperties.title)) );
        this.manipulator.removeChild(this.image, child as SVGGElement);
      }
    );
    const newChildren = Array.from(by.childNodes);
    for(const child of newChildren) {
      this.drawStack.addElementWithInfos( {
        target: (child as SVGGElement),
        id: Number((child as SVGGElement).getAttribute(SVGProperties.title)) 
      });
      this.manipulator.appendChild(this.image.nativeElement, child.cloneNode(true) as SVGGElement);
    }
  }

  private setCurrent(current: SVGElement): void {
    if(this.currentSVG !== undefined) {
      this.elements.push_back(this.currentSVG);
    }
    this.currentSVG = current;
  }

  private addElement(toAdd: SVGElement): void {
    this.elements.push_back(toAdd);
  }

  private isEmpty(): boolean {
    return this.elements.getAll().length === 0;
  }
}