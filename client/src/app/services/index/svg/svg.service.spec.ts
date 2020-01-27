import { TestBed } from '@angular/core/testing';

import { SVGService } from './svg.service';
// import { SVGProperties } from 'src/app/classes/svg-html-properties';

describe('SVGService', () => {

  let stack: SVGService;

  beforeAll( () => { stack = new SVGService(); } );

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SVGService = TestBed.get(SVGService);
    expect(service).toBeTruthy();
  });

  it('should return empty stack', () => {
    expect(stack.getStack().getAll().length).toBe(0);
  })

  it('should return non empty stack', () => {
    stack.addElement(new SVGGElement());
    expect(stack.getStack().getAll().length).toBe(1);
  })

  // it('should add element at the end', () => {
  //   const toAdd = new SVGGElement();
  //   toAdd.setAttribute(SVGProperties.title, 'test');
  //   stack.addElement(toAdd);
  //   const element = stack.getStack().getLast();
  //   expect(element?.getAttribute(SVGProperties.title)).toBe('test');
  // })

  // it('should add element', () => {
  //   const toAdd = new SVGGElement();
  //   toAdd.setAttribute(SVGProperties.title, 'test');
  //   stack.addElement(toAdd);
  //   const toAdd2 = new SVGGElement();
  //   toAdd2.setAttribute(SVGProperties.title, 'test2');
  //   stack.addElement(toAdd2);
  //   const element = stack.getStack().getAll()[0];
  //   expect(element?.getAttribute(SVGProperties.title)).toBe('test');
  // })

  // it('should remove last element', () => {
  //   const toAdd = new SVGGElement();
  //   toAdd.setAttribute(SVGProperties.title, 'test');
  //   stack.addElement(toAdd);
  //   const toAdd2 = new SVGGElement();
  //   toAdd2.setAttribute(SVGProperties.title, 'test2');
  //   stack.addElement(toAdd2);
  //   const lastElement = stack.removeLastElement();
  //   const element = stack.getStack().getLast();
  //   expect(element?.getAttribute(SVGProperties.title)).toBe('test');
  //   expect(lastElement?.getAttribute(SVGProperties.title)).toBe('test2');
  // })

  it('should be get undefined last element', () => {
    expect(stack.removeLastElement()).toBe(undefined);
  })
});
