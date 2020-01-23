import { Stack } from './stack';

describe('Stack', () => {

  let stack: Stack<number>;
  const emptyArray: Stack<number> = new Stack<number>();
  beforeEach(() => { stack = new Stack<number>(); });

  it('should create an instance', () => {
    expect(new Stack()).toBeTruthy();
  });

  it('should add element at the end', () => {
    for (let i = 0; i < 5; i++) {
      stack.push_back(i);
    }
    const result: number[] = [0, 1, 2, 3, 4];
    expect(stack.getAll()).toBe(result);
  });

  it('should add element at the beginning', () => {
    for (let i = 0; i < 5; i++) {
      stack.push_front(i);
    }
    const result: number[] = [4, 3, 2, 1, 0];
    expect(stack.getAll()).toBe(result);
  });

  it('should remove element from the beginning', () => {
    for (let i = 0; i < 5; i++) {
      stack.push_front(i);
    }
    stack.pop_front();
    const result: number[] = [3, 2, 1, 0];
    expect(stack.getAll()).toBe(result);
  });

  it('should remove element from the beginning', () => {
    for (let i = 0; i < 5; i++) {
      stack.push_front(i);
    }
    stack.pop_back();
    const result: number[] = [4, 3, 2, 1];
    expect(stack.getAll()).toBe(result);
  });

  it('should clear empty element', () => {
    expect(stack.clear()).toBe(emptyArray);
  });

  it('should clear element containing values', () => {
    for (let i = 0; i < 5; i++) {
      stack.push_front(i);
    }
    expect(stack.clear()).toBe(emptyArray);
  });

  it('should delete element in the middle', () => {
    for (let i = 0; i < 5; i++) {
      stack.push_back(i);
    }
    const result: number[] = [0, 1, 2, 4];
    expect(stack.delete(3)).toBe(result);
    expect(stack.getAll().length).toBe(result.length);
  });

  it('should delete element from beginning', () => {
    for (let i = 0; i < 5; i++) {
      stack.push_back(i);
    }
    const result: number[] = [1, 2, 3, 4];
    expect(stack.delete(0)).toBe(result);
    expect(stack.getAll().length).toBe(result.length);
  });

  it('should delete element from end', () => {
    for (let i = 0; i < 5; i++) {
      stack.push_back(i);
    }
    const result: number[] = [0, 1, 2, 3];
    expect(stack.delete(4)).toBe(result);
    expect(stack.getAll().length).toBe(result.length);
  });
});
