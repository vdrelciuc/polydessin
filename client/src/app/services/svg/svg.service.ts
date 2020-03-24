import { Injectable } from '@angular/core';
import { Stack } from 'src/app/classes/stack';

@Injectable({
  providedIn: 'root'
})
export class SVGService {

  private svgStack: Stack<SVGGElement>;

  constructor() {
    this.svgStack = new Stack<SVGGElement>();
  }

  getStack(): Stack<SVGGElement> { return this.svgStack; }

  addElement(toAdd: SVGGElement): void { this.svgStack.push_back(toAdd); }

  removeLastElement(): SVGGElement | undefined { return this.svgStack.pop_back(); }
}
