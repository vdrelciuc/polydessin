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
      if(toAdd.id !== this.nextId) {
        // this.percolateUpIDs(toAdd.id);
        this.changeAt.next(toAdd.id);
      }
      this.elements.insert(toAdd, toAdd.id);
    }
    console.log(this.elements.getAll());
  }

  removeElement(toRemove: number): void  {
    for(const element of this.elements.getAll()) {
      if(element.id === toRemove) {
        this.elements.delete(element);
        this.nextId--;
        // this.percolateDownIDs(toRemove);
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

  getRoot(): SVGElementInfos | undefined {
    return this.elements.getRoot();
  }

  getNextID(): number { return this.nextId++; }

  // private percolateDownIDs(from: number): void {
  //   let newStack = new Stack<SVGElementInfos>();
  //   for(const element of this.elements.getAll()) {
  //     if(element.id >= from) {
  //       element.id--;
  //     }
  //     newStack.push_back(element);
  //   }
  //   this.elements = newStack;
  // }

  // private percolateUpIDs(from: number): void {
  //   let newStack = new Stack<SVGElementInfos>();
  //   for(const element of this.elements.getAll()) {
  //     if(element.id > from) {
  //       element.id++;
  //     }
  //     newStack.push_back(element);
  //   }
  //   this.elements = newStack;
  // }
}
