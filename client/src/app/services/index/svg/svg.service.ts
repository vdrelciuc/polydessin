import { Injectable } from '@angular/core';
import { Stack } from 'src/app/classes/svg-stack';

@Injectable({
  providedIn: 'root'
})
export class SVGService {

  private svgStack: Stack<SVGGElement>;


  constructor() {
    this.svgStack = new Stack();
  }
}
