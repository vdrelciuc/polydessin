import { Transform } from './transformations';
import { Renderer2, Type } from '@angular/core';
import { TestBed, getTestBed } from '@angular/core/testing';
//import { Stack } from './stack';
//import { SVGElementInfos } from '../interfaces/svg-element-infos';
//import { SVGProperties } from './svg-html-properties';

fdescribe('Transform', () => {

    let manipulator: Renderer2;
    //let elementInStack: SVGGElement;
    //let elements: Stack<mockedSVGElementInfos>;
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

    /*const mockedGetAttribute = (name: string): string | null => {
        console.log("mockedGetAttribute called with name - " + name + " -. Return: " + transform);
        return transform;
    };*/

    //let el = null as unknown as SVGGElement;
    class mockedSVGElementInfos {
        target = null as unknown as SVGGElement;
        id = 0
    };

    /*class mockedRenderer extends Renderer2 {
        data: { [key: string]: any; };
        destroy(): void {
            throw new Error("Method not implemented.");
        }
        createComment(value: string) {
            throw new Error("Method not implemented.");
        }
        createText(value: string) {
            throw new Error("Method not implemented.");
        }
        appendChild(parent: any, newChild: any): void {
            throw new Error("Method not implemented.");
        }
        insertBefore(parent: any, newChild: any, refChild: any): void {
            throw new Error("Method not implemented.");
        }
        removeChild(parent: any, oldChild: any, isHostElement?: boolean | undefined): void {
            throw new Error("Method not implemented.");
        }
        selectRootElement(selectorOrNode: any, preserveContent?: boolean | undefined) {
            throw new Error("Method not implemented.");
        }
        parentNode(node: any) {
            throw new Error("Method not implemented.");
        }
        nextSibling(node: any) {
            throw new Error("Method not implemented.");
        }
        removeAttribute(el: any, name: string, namespace?: string | null | undefined): void {
            throw new Error("Method not implemented.");
        }
        addClass(el: any, name: string): void {
            throw new Error("Method not implemented.");
        }
        removeClass(el: any, name: string): void {
            throw new Error("Method not implemented.");
        }
        setStyle(el: any, style: string, value: any, flags?: import("@angular/core").RendererStyleFlags2 | undefined): void {
            throw new Error("Method not implemented.");
        }
        removeStyle(el: any, style: string, flags?: import("@angular/core").RendererStyleFlags2 | undefined): void {
            throw new Error("Method not implemented.");
        }
        setProperty(el: any, name: string, value: any): void {
            throw new Error("Method not implemented.");
        }
        setValue(node: any, value: string): void {
            throw new Error("Method not implemented.");
        }
        listen(target: any, eventName: string, callback: (event: any) => boolean | void): () => void {
            throw new Error("Method not implemented.");
        }
        constructor() {
            super();
        }
        createElement(tag: string, source: string): mockedSVGGElement {
            console.log("mockedCreate called");
            return new mockedSVGGElement();
        };

        setAttribute(parentElement: mockedSVGGElement, name: string, newTransform: string): void {
            transform = newTransform;
            console.log("mockedSet called with name: " + name);
        };
    }*/

    class mockedSVGGElement extends SVGGElement {
        getAttribute(name: string): string | null {
            console.log("mockedGetAttribute called with name - " + name + " -. Return: " + transform);
            return transform;
        };
    }

    const mockedRendered = (parentElement: any, name: string, debugInfo?: any): DOMRect => {
        const element = new Element();
        parentElement.children.push(element);
        return new DOMRect(50, 50, 100, 100);
    };

    const mockedAttribute = () => ({
        transform: ''
    });
    
    beforeEach( () => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: () => mockedRendered,
                        setAttribute: () => mockedRendered,
                        appendChild: () => mockedRendered,
                        removeChild: () => mockedRendered,
                    },
                },
                { provide: SVGGElement, useClass: mockedSVGGElement }
            ]
        });
        manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
        Transform['manipulator'] = manipulator;

        //spyOn(manipulator, 'createElement').and.callFake(mockedCreateElement);
        /*elementInStack = manipulator.createElement('g', 'http://www.w3.org/2000/svg');
        console.log("xd");
        elements = new Stack<SVGElementInfos>();
        elements.push_back({ target: elementInStack, id: 1 });*/

        //Transform['elementsToTransform'] = [mockedSVGElementInfo];
        //Transform['manipulator'] = manipulator;
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
        //Transform['manipulator'] = manipulator;
        //Transform.setElements(elements, manipulator);
        //const mockedEl = new mockedSVGElementInfos();
        //elements.push_back(new mockedSVGElementInfos());
        //Transform['elementsToTransform'] = [new mockedSVGElementInfos()];
        //spyOn(mockedSVGElementInfo.target, 'getAttribute').and.callFake(mockedGetAttribute);
        //elements.getAll = jasmine.createSpy().and.returnValue(true);
        let element = new mockedSVGElementInfos();
        Transform['elementsToTransform'] = [element];
        console.log((element.target).getAttribute('transform'));
        element.target.getAttribute = jasmine.createSpy().and.callFake(mockedAttribute);
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