import { Transform } from './transformations';
import { Renderer2, /*Type,*/ ElementRef } from '@angular/core';
import { /*getTestBed,*/ TestBed } from '@angular/core/testing';
//import { Stack } from './stack';
//import { SVGElementInfos } from '../interfaces/svg-element-infos';
//import { SVGProperties } from './svg-html-properties';

describe('Transform', () => {

    let manipulator: Renderer2;
    //let elementInStack: SVGGElement;
    //let elements: Stack<SVGElementInfos>;
    let transform: string | null = null;

    /*const mockedCreateElement = (tag: string, source: string): SVGGElement => {
        let el = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        console.log("mockedCreate called");
        return el;
    };*/

   /*const mockedSetAttribute = (parentElement: SVGGElement, name: string, newTransform: string): void => {
        transform = newTransform;
        console.log("mockedSet called with name: " + name);
    };*/

    const mockedGetAttribute = (name: string): string | null => {
        console.log("mockedGetAttribute called with name - " + name + " -. Return: " + transform);
        return transform;
    };

    const mockedSVGElementInfo = {
        target: null as unknown as SVGGElement,
        id: 0
    };

    class mockedRenderer {
        createElement(tag: string, source: string): mockedSVGGElement {
            console.log("mockedCreate called");
            return new mockedSVGGElement();
        };

        setAttribute(parentElement: mockedSVGGElement, name: string, newTransform: string): void {
            transform = newTransform;
            console.log("mockedSet called with name: " + name);
        };
    }

    class mockedSVGGElement {
        constructor() {};
        getAttribute(name: string): string | null {
            console.log("mockedGetAttribute called with name - " + name + " -. Return: " + transform);
            return transform;
        };
    }
    
    beforeEach( () => {
        TestBed.configureTestingModule({
            providers: [
                { provide: Renderer2, useClass: mockedRenderer },
                { provide: ElementRef, useClass: mockedSVGGElement }
            ]
        });
        //manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);

        //spyOn(manipulator, 'createElement').and.callFake(mockedCreateElement);
        /*elementInStack = manipulator.createElement('g', 'http://www.w3.org/2000/svg');
        console.log("xd");
        elements = new Stack<SVGElementInfos>();
        elements.push_back({ target: elementInStack, id: 1 });*/

        Transform['elementsToTransform'] = [mockedSVGElementInfo];
        Transform['manipulator'] = manipulator;
    });

    it('mocked functions should be set properly', () => {
        /*spyOn(manipulator, 'setAttribute').and.callFake(mockedSetAttribute);
        transform = null;
        //manipulator.setAttribute(elementInStack, SVGProperties.transform, '');
        console.log("transform: " + transform);
        spyOn(elements.getAll()[0].target, 'getAttribute').and.callFake(mockedGetAttribute);
        
        Transform.translate(10, 10);
        const newTransform = elements.getAll()[0].target.getAttribute(SVGProperties.transform);
        expect(newTransform).toBe('transform(10, 12)');*/
        /*transform = null;
        //spyOn(Transform['manipulator'], 'setAttribute').and.callFake(mockedSetAttribute);
        spyOn(Transform['elementsToTransform'][0].target, 'getAttribute').and.callFake(mockedGetAttribute);
        //spyOn(elementInStack, 'getAttribute').and.callFake(mockedGetAttribute);
        Transform.translate(10, 10);
        //expect(true).toBe(true);*/
    });

    it('asdasd', () => {
        /*Transform['manipulator'].setAttribute = jasmine.createSpy().and.callFake(mockedSetAttribute);
        Transform['elementsToTransform'][0].target.getAttribute = jasmine.createSpy().and.callFake(mockedGetAttribute);
        Transform.translate(10, 10);
        expect(transform).toBe('translate(10, 10');*/
        //spyOn(Transform['manipulator'], 'setAttribute').and.callFake(mockedSetAttribute);
        spyOn(Transform['elementsToTransform'][0].target, 'getAttribute').and.callFake(mockedGetAttribute);
        
        Transform.translate(10, 10);
        //const newTransform = elements.getAll()[0].target.getAttribute(SVGProperties.transform);
        expect(transform).toBe('transform(10, 12)');
    });

    /*it('#setElements should initialize class attributes', () => {
        expect(Transform['elementsToTransform'].length).toBe(0);
        Transform.setElements(elements, manipulator);
        expect(Transform['elementsToTransform'].length).toBe(1);
        expect(Transform['manipulator']).toEqual(manipulator);
    });*/
});