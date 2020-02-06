export class Stack<T> {

  private stack: T[];

  constructor() {
    this.stack = new Array<T>();
    this.stack = [];
  }

  delete(toDelete: T): void {
    if (this.stack.length > 0) {
      const indexToRemove = this.stack.indexOf(toDelete);
      if(indexToRemove !== -1) {
        this.stack.splice(indexToRemove, 1);
      }
    }
  }

  push_back(toAdd: T): void {
    this.stack.push(toAdd);
  }

  pop_back(): T | undefined {
    if (this.stack.length > 1) {
      return this.stack.splice(this.stack.length - 1, 1)[0];
    }
    return undefined;
  }

  clear(): void {
    const stackLength = this.stack.length;
    if (stackLength > 0) {
      this.stack.splice(0, this.stack.length);
    }
  }

  push_front(toAdd: T): void {
    const slicedArray: T[] = this.stack.splice(0, this.stack.length);
    this.stack[0] = toAdd;
    for (const element of slicedArray) {
      this.stack.push(element);
    }
  }

  pop_front(): T | undefined {
    if (this.stack.length > 1) {
      const toReturn: T = this.stack[0];
      this.stack = this.stack.splice(1, this.stack.length);
      return toReturn;
    }
    return undefined;
  }

  getAll(): T[] { return this.stack; }

  getLast(): T | undefined {
    if (this.stack.length > 0) {
      return this.stack[this.stack.length - 1];
    }
    return undefined;
  }

  getRoot(): T | undefined {
    if(this.stack.length > 0) {
      return this.stack[0];
    } 
    return undefined;
  }
}
