import { TestBed, getTestBed } from '@angular/core/testing';
import { SVGService } from './svg.service';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { Renderer2, Type, ElementRef } from '@angular/core';

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

  it('should return empty stack', () => {
    expect(stack.getStack().getAll().length).toEqual(0);
  });

  it('should return non empty stack', () => {
    let element: SVGGElement = manipulator.createElement('g', 'http://www.w3.org/2000/svg');
    manipulator.setAttribute(element, SVGProperties.title, 'test');
    stack.addElement(element);
    expect(stack.getStack().getAll().length).toEqual(1);
  });

  it('should add element at the end', () => {
    const toAdd: SVGGElement = manipulator.createElement('g');
    manipulator.setAttribute(toAdd, SVGProperties.title, 'test');
    stack.addElement(toAdd);
    const element: SVGGElement | undefined = stack.getStack().getLast();
    if(element !== undefined) {
      const svgElement = manipulator.createElement('svg', 'http://www.w3.org/2000/svg');
      let reference = new ElementRef<SVGElement>(svgElement);
      manipulator.appendChild(svgElement, element);
      manipulator.appendChild(reference.nativeElement, svgElement);
      console.log(reference);
      expect(reference.nativeElement.getAttribute(SVGProperties.title)).toEqual('test');
    }
  });

  it('should add element', () => {
    const toAdd = manipulator.createElement('g');
    manipulator.setAttribute(toAdd, SVGProperties.title, 'test');
    stack.addElement(toAdd);
    const toAdd2 = manipulator.createElement('g');
    manipulator.setAttribute(toAdd2, SVGProperties.title, 'test2');
    stack.addElement(toAdd2);
    const element = stack.getStack().getAll()[0];
    if(element !== undefined) {
      expect(element.getAttribute(SVGProperties.title)).toEqual('test');
    }
  });

  it('should remove last element', () => {
    stack.addElement(manipulator.createElement('g'));
    const toAdd2 = manipulator.createElement('g');
    manipulator.setAttribute(toAdd2, SVGProperties.title, 'test2');
    stack.addElement(toAdd2);
    const lastElement = stack.removeLastElement();
    const element = stack.getStack().getLast();
    if(element !== undefined && lastElement !== undefined) {
      expect(element.getAttribute(SVGProperties.title)).toEqual('test');
      expect(lastElement.getAttribute(SVGProperties.title)).toEqual('test2');
    }
  });

  it('should be get undefined last element', () => {
    expect(stack.removeLastElement()).toBe(undefined);
  })
});