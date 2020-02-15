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

  constructor() { 
    this.elements = new Stack<SVGElementInfos>();
    this.nextId = 0;
    this.isAdding = new BehaviorSubject<boolean>(false);
  }

  addElement(toAdd: SVGElement): void {
    if(toAdd !== undefined) {
      this.addElementWithInfos({
        target: toAdd,
        id: this.nextId++
      });
      this.isAdding.next(true);
    }
  }

  addElementWithInfos(toAdd: SVGElementInfos): void {
    if(toAdd !== undefined) {
      this.elements.push_back(toAdd);
    }
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

  isEmpty(): boolean {
    return this.nextId === 0;
  }

  findTopElementAt(position: CoordinatesXY): SVGElement | undefined {
    const array = this.elements.getAll();
    for(let i: number = array.length - 1; i >= 0; i--) {
      if(position.inRadius(array[i].target.getBoundingClientRect())) {
        return array[i].target;
      }
    }
    return undefined;
  }
}
