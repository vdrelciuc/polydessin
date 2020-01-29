import { Stack } from './stack';

describe('Stack', () => {

  let stack: Stack<number>;

  beforeEach( () => { stack = new Stack<number>(); } );

  it('should create an instance', () => {
    expect(new Stack<number>()).toBeTruthy();
  });

  it('should add to the end', () => {
    for (let i = 0; i < 5; ++i) {
      stack.push_back(i);
    }
    expect(stack.getAll()).toEqual([0, 1, 2, 3, 4]);
  });

  it('should add to the beginning', () => {
    for (let i = 0; i < 5; ++i) {
      stack.push_front(i);
    }
    expect(stack.getAll()).toEqual([4, 3, 2, 1, 0]);
  });

  it('should remove from the end', () => {
    for (let i = 0; i < 5; ++i) {
      stack.push_back(i);
    }
    stack.pop_back();
    expect(stack.getAll()).toEqual([0, 1, 2, 3]);
  });

  it('should remove from the beginning', () => {
    for (let i = 0; i < 5; ++i) {
      stack.push_back(i);
    }
    stack.pop_front();
    expect(stack.getAll()).toEqual([1, 2, 3, 4]);
  });

  it('should clear', () => {
    for (let i = 0; i < 5; ++i) {
      stack.push_back(i);
    }
    stack.clear();
    expect(stack.getAll()).toEqual([]);
  });

  it('should delete in the middle', () => {
    for (let i = 0; i < 5; ++i) {
      stack.push_back(i);
    }
    stack.delete(3);
    expect(stack.getAll()).toEqual([0, 1, 2, 4]);
  });

  it('should delete last element', () => {
    for (let i = 0; i < 5; ++i) {
      stack.push_back(i);
    }
    stack.delete(4);
    expect(stack.getAll()).toEqual([0, 1, 2, 3]);
  });

  it('should delete first element', () => {
    for (let i = 0; i < 5; ++i) {
      stack.push_back(i);
    }
    stack.delete(0);
    expect(stack.getAll()).toEqual([1, 2, 3, 4]);
  });

  it('should not delete non existent element', () => {
    for (let i = 0; i < 5; ++i) {
      stack.push_back(i);
    }
    stack.delete(9);
    expect(stack.getAll()).toEqual([0, 1, 2, 3, 4]);
  });

  it('should return undefined last element on empty array', () => {
    expect(stack.getLast()).toEqual(undefined);
  });

  it('should return last element', () => {
    for (let i = 0; i < 5; ++i) {
      stack.push_back(i);
    }
    expect(stack.getLast()).toBe(4);
  });

  it('should return undefined last element', () => {
    for (let i = 0; i < 5; ++i) {
      stack.push_back(i);
    }
    for(let i = 0; i < 5; i++) {
      stack.pop_back();
    }
    expect(stack.getLast()).toBe(undefined);
  });

  it('should return first element', () => {
    for (let i = 0; i < 5; ++i) {
      stack.push_back(i);
    }
    expect(stack.getRoot()).toBe(0);
  })

  it('should return undefined first element', () => {
    expect(stack.getRoot()).toBe(undefined);
  })
});
