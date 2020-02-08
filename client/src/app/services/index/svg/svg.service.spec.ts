import { TestBed, getTestBed } from '@angular/core/testing';
import { SVGService } from './svg.service';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { Renderer2, Type } from '@angular/core';

describe('SVGService', () => {

 
  let stack: SVGService;
  let manipulator: Renderer2;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SVGService,
        {
          provide: Renderer2,
          useValue: {
              setAttribute: () => null,
              createElement: () => ({} as unknown) as SVGElement,
              appendChild: () => null,
              removeChild: () => null,
          },
      },
    ]
    });
    stack = getTestBed().get(SVGService)
    manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
  });

  it('should be created', () => {
    expect(stack).toBeTruthy();
  });

  it('#getStack should return empty stack', () => {
    expect(stack.getStack().getAll().length).toEqual(0);
  });

  it('#getStack should return non empty stack', () => {
    let element: SVGGElement = manipulator.createElement('g', 'http://www.w3.org/2000/svg');
    manipulator.setAttribute(element, SVGProperties.title, 'test');
    stack.addElement(element);
    expect(stack.getStack().getAll().length).toEqual(1);
  });

  it('#addElement should add element at the end', () => {
    const toAdd: SVGGElement = manipulator.createElement('g');
    manipulator.setAttribute(toAdd, SVGProperties.title, 'test');
    stack.addElement(toAdd);
    const toAdd2: SVGGElement = manipulator.createElement('g');
    manipulator.setAttribute(toAdd, SVGProperties.title, 'test22');
    stack.addElement(toAdd);
    expect(stack.getStack().getLast()).toEqual(toAdd2);
  });

  it('#removeLastElement should remove all elements', () => {
    while(stack.removeLastElement() !== undefined) {}
    expect(stack.getStack().getAll().length).toEqual(0);
  });

  it('#removeLastElement should be get undefined last element', () => {
    expect(stack.removeLastElement()).toBe(undefined);
  })
});