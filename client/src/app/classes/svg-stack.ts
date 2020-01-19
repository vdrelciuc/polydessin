export class SVGStack {

  private stack: SVGGElement[];

  constructor() {
    this.stack = new Array<SVGGElement>();
  }

  delete(toDelete: SVGGElement): void {
    this.stack.splice(this.stack.indexOf(toDelete), 1);
  }

  push_back(toAdd: SVGGElement): void {
    this.stack.push(toAdd);
  }

  pop_back(): SVGGElement {
    return this.stack.splice(this.stack.length - 1, 1)[0];
  }

  clear(): void {
    this.stack.splice(0, this.stack.length);
  }

  push_front(toAdd: SVGGElement): void {
    const slicedArray: SVGGElement[] = this.stack.splice(0, this.stack.length);
    this.stack[0] = toAdd;
    for(const element of slicedArray) {
      this.stack.push(element);
    }
  }

  pop_front(): SVGGElement {
    const toReturn: SVGGElement = this.stack[0];
    this.stack = this.stack.splice(1, this.stack.length);
    return toReturn;
  }
}
