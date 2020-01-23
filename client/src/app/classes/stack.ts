export class Stack<T> {

  private stack: T[];

  constructor() {
    this.stack = new Array<T>();
  }

  delete(toDelete: T): void {
    this.stack.splice(this.stack.indexOf(toDelete), 1);
  }

  push_back(toAdd: T): void {
    this.stack.push(toAdd);
  }

  pop_back(): T {
    return this.stack.splice(this.stack.length - 1, 1)[0];
  }

  clear(): void {
    this.stack.splice(0, this.stack.length);
  }

  push_front(toAdd: T): void {
    const slicedArray: T[] = this.stack.splice(0, this.stack.length);
    this.stack[0] = toAdd;
    for(const element of slicedArray) {
      this.stack.push(element);
    }
  }

  pop_front(): T {
    const toReturn: T = this.stack[0];
    this.stack = this.stack.splice(1, this.stack.length);
    return toReturn;
  }
}
