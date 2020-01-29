import { TestBed } from '@angular/core/testing';
//import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { SVGService } from './svg.service';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { Renderer2 } from '@angular/core';

describe('SVGService', () => {

  let stack: SVGService;
  let manipulator: Renderer2;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    stack = new SVGService();
  });

  it('should be created', () => {
    const service: SVGService = TestBed.get(SVGService);
    expect(service).toBeTruthy();
  });

  it('should return empty stack', () => {
      expect(stack.getStack().getAll().length).toEqual(0);
    })

  it('should return non empty stack', () => {
      const element = manipulator.createElement('g');
      element.setAttribute(SVGProperties.title, 'test');
      stack.addElement(element);
      expect(stack.getStack().getAll().length).toEqual(1);
    })

  it('should add element at the end', () => {
      const toAdd = manipulator.createElement('g');
      toAdd.setAttribute(SVGProperties.title, 'test');
      stack.addElement(toAdd);
      const element = stack.getStack().getLast();
      if(element !== undefined) {
        expect(element.getAttribute(SVGProperties.title)).toBe('test');
      }
    })

  it('should add element', () => {
    const toAdd = manipulator.createElement('g');
      toAdd.setAttribute(SVGProperties.title, 'test');
      stack.addElement(toAdd);
      const toAdd2 = manipulator.createElement('g');
      toAdd2.setAttribute(SVGProperties.title, 'test2');
      stack.addElement(toAdd2);
      const element = stack.getStack().getAll()[0];
      if(element !== undefined) {
        expect(element.getAttribute(SVGProperties.title)).toEqual('test');
      }
    })

  it('should remove last element', () => {
      stack.addElement(new SVGGElement());
      const toAdd2 = manipulator.createElement('g');
      toAdd2.setAttribute(SVGProperties.title, 'test2');
      stack.addElement(toAdd2);
      const lastElement = stack.removeLastElement();
      const element = stack.getStack().getLast();
      if(element !== undefined && lastElement !== undefined) {
        expect(element.getAttribute(SVGProperties.title)).toEqual('test');
        expect(lastElement.getAttribute(SVGProperties.title)).toEqual('test2');
      }
    })

  it('should be get undefined last element', () => {
      expect(stack.removeLastElement()).toBe(undefined);
    })
});
