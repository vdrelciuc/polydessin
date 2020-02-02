import { ElementRef } from '@angular/core';

export class Coords {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static getCoords(pointer: MouseEvent): Coords {
    return new Coords(pointer.clientX, pointer.clientY);
  }

  static getEffectiveCoords(referenceElement: ElementRef<SVGElement>, pointer: MouseEvent): Coords {
    return new Coords(Coords.effectiveX(referenceElement, pointer.clientX), Coords.effectiveY(referenceElement, pointer.clientY));
  }

  static effectiveX(referenceElement: ElementRef<SVGElement>, onScreenX: number): number {
    return onScreenX - referenceElement.nativeElement.getBoundingClientRect().left;
  }

  static effectiveY(referenceElement: ElementRef<SVGElement>, onScreenY: number): number {
    return onScreenY - referenceElement.nativeElement.getBoundingClientRect().top;
  }

  getQuadrant(origin: Coords): 1 | 2 | 3 | 4 {
    //    2 | 1
    //   ---|---
    //    3 | 4

    const isTop = this.y < origin.y;
    const isLeft = this.x < origin.x;

    return isTop ? (isLeft ? 2 : 1) : (isLeft ? 3 : 4);
  }
}
