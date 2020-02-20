import { Injectable } from '@angular/core';
import { Stack } from 'src/app/classes/stack';
import { SVGElementInfos } from 'src/app/interfaces/svg-element-infos';
import { BehaviorSubject } from 'rxjs';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';

@Injectable({
  providedIn: 'root'
})
export class DrawStackService {

  private elements: Stack<SVGElementInfos>;
  private nextId: number;
  isAdding: BehaviorSubject<boolean>;
  changeAt: BehaviorSubject<number>

  constructor() { 
    this.elements = new Stack<SVGElementInfos>();
    this.nextId = 0;
    this.isAdding = new BehaviorSubject<boolean>(false);
    this.changeAt = new BehaviorSubject<number>(0);
  }

  getAll(): Stack<SVGElementInfos> { return this.elements; }

  addElement(toAdd: SVGGElement): void {
    if(toAdd !== undefined) {
      this.addElementWithInfos({
        target: toAdd,
        id: this.nextId
      });
      this.nextId++; // Je sais je peux faire ++, GARDER CA LA
      this.isAdding.next(true);
    }
  }

  addElementWithInfos(toAdd: SVGElementInfos): void {
    if(toAdd !== undefined) {
      this.elements.insert(toAdd, toAdd.id);
      if(toAdd.id !== this.nextId) {
        this.changeAt.next(toAdd.id);
      }
    }
  }

  removeElement(toRemove: number): void  {
    for(const element of this.elements.getAll()) {
      if(element.id === toRemove) {
        this.elements.delete(element);
        this.nextId--;
        this.percolateDownIDs(toRemove);
      }
    }
  }
  
  removeLastElement(): SVGElementInfos | undefined {
    const lastElement = this.elements.pop_back();
    if(lastElement !== undefined) {
      this.isAdding.next(false);
      this.nextId--;
    }
    return lastElement;
  }

  isEmpty(): boolean {
    return this.nextId === 0;
  }

  size(): number {
    return this.elements.getAll().length;
  }

  findTopElementAt(position: CoordinatesXY): SVGElementInfos | undefined {
    const array = this.elements.getAll();
    for(let i: number = array.length - 1; i >= 0; i--) {
      if(position.inRadius(array[i].target.getBoundingClientRect())) {
        return array[i];
      }
    }
    return undefined;
  }

  hasElementIn(elementID: number, zone: DOMRect): SVGElementInfos | undefined {
    const element = this.elements.getAll()[elementID].target.getBoundingClientRect();
    const isIncludedX = zone.left <= element.right && zone.right >= element.left;
    const isIncludedY = zone.top <= element.bottom && zone.bottom >= element.top;

    return (isIncludedX && isIncludedY) ? this.elements.getAll()[elementID] : undefined;
  }

  removeElements(from: number): SVGElementInfos[] {
    let toRemove: SVGElementInfos[] = [];
    let j = 0;
    for(let i: number = this.elements.getAll().length - 1 ; i >= from; i--) {
      const poped = this.elements.pop_back();
      if(poped !== undefined) {
        toRemove[j] = poped;
      }
    }
    return toRemove;
  }

  private percolateDownIDs(from: number): void {
    let newStack = new Stack<SVGElementInfos>();
    for(const element of this.elements.getAll()) {
      if(element.id >= from) {
        element.id--;
      }
      newStack.push_back(element);
    }
    this.elements = newStack;
  }
}
