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
    this.changeAt = new BehaviorSubject<number>(-1);
  }

  addElementWithInfos(toAdd: SVGElementInfos): void {
    if(toAdd !== undefined) {
      if(toAdd.id < this.nextId) {
        this.changeAt.next(toAdd.id);
      }
      this.isAdding.next(true);
      this.elements.insert(toAdd, toAdd.id);
      this.nextId++;
    }
  }

  addFromUndo(toAdd: SVGElementInfos): void {
    this.elements.insert(toAdd, toAdd.id);
  }

  removeElement(toRemove: number): void  {
    for(const element of this.elements.getAll()) {
      if(element.id === toRemove) {
        this.elements.delete(element);
        this.nextId--;
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

  removeElements(from: number): Stack<SVGElementInfos> {
    let toRemove = new Stack<SVGElementInfos>();
    let poped = this.elements.pop_back();
    while(poped !== undefined) {
      toRemove.push_front(poped);
      poped = this.elements.pop_back();
      if(poped !== undefined && poped.id < from) {
        this.elements.push_back(poped);
        break;
      }
    }
    this.nextId -= (toRemove.getAll().length - 1);
    return toRemove;
  }

  isEmpty(): boolean {
    return this.elements.getAll().length === 0;
  }

  findTopElementAt(position: CoordinatesXY): SVGElementInfos | undefined {
    return DrawStackService.findTopElementAt(position, this.elements);
  }

  static findTopElementAt(position: CoordinatesXY, elements: Stack<SVGElementInfos>): SVGElementInfos | undefined {
    const array = elements.getAll();
    for(let i: number = array.length - 1; i >= 0; i--) {
      if(position.inRadius(array[i].target.getBoundingClientRect())) {
        return array[i];
      }
    }
    return undefined;
  }

  getRoot(): SVGElementInfos | undefined {
    return this.elements.getRoot();
  }

  getNextID(): number { return this.nextId; }
}
