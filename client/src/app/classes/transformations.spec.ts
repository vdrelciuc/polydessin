/*tslint:disable: no-magic-numbers*/
import { Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Stack } from './stack';
import { Transform } from './transformations';

describe('Transform', () => {

    let manipulator: Renderer2;
    let transform: string | null;
    let stack: Stack<SVGGElement>;

    const mockedSetAttribute = (el: SVGGElement, name: string, value: string, namespace?: string | null | undefined): void => {
        transform = value;
    };

    const resetTransform = () => { transform = null; };

    beforeEach( () => {
        TestBed.configureTestingModule({
            providers: [Renderer2]
        });
        manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);

        manipulator.setAttribute = jasmine.createSpy().and.callFake(mockedSetAttribute);

        resetTransform();

        const element: SVGGElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        stack = new Stack<SVGGElement>();
        stack.push_back(element);
        Transform.setElements(stack, manipulator);
    });

    it('#setElements should initialize class attributes', () => {
        // setElements is called in beforeEach to be used in all other tests
        // We will reset it only for this test

        // Reset on elements to transform
        stack = new Stack<SVGGElement>();
        Transform['elementsToTransform'] = [];
        expect(Transform['elementsToTransform'].length).toBe(0);

        // Adding new element
        const element: SVGGElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        stack.push_back(element);
        Transform.setElements(stack, manipulator);

        expect(Transform['elementsToTransform'].length).toBe(1);
        expect(Transform['manipulator']).toEqual(manipulator);
    });

    it('#translate should add transform attribute to SVGGElement if it does not exist (positive values)', () => {
        Transform['elementsToTransform'][0].getAttribute = jasmine.createSpy().and.returnValue(transform);

        Transform.translate(10, 20);
        expect(transform).toBe('translate(10, 20)');
    });

    it('#translate should add transform attribute to SVGGElement if it does not exist (origin)', () => {
        Transform['elementsToTransform'][0].getAttribute = jasmine.createSpy().and.returnValue(transform);

        Transform.translate(0, 0);
        expect(transform).toBe('translate(0, 0)');
    });

    it('#translate should add transform attribute to SVGGElement if it does not exist (negative values)', () => {
        Transform['elementsToTransform'][0].getAttribute = jasmine.createSpy().and.returnValue(transform);

        Transform.translate(-10, -20);
        expect(transform).toBe('translate(-10, -20)');
    });

    it('#translate should add transform attribute to SVGGElement if it does not exist (positive and negative values)', () => {
        Transform['elementsToTransform'][0].getAttribute = jasmine.createSpy().and.returnValue(transform);

        Transform.translate(10, -20);
        expect(transform).toBe('translate(10, -20)');
    });

    it('#translate should add translate property to transform attribute if transform exists but translate does not (positive)', () => {
        transform = 'rotate(-20)';
        Transform['elementsToTransform'][0].getAttribute = jasmine.createSpy().and.returnValue(transform);

        Transform.translate(10, 20);
        expect(transform).toBe('rotate(-20) translate(10, 20)');
    });

    it('#translate should add translate property to transform attribute if transform exists but translate does not (negative)', () => {
        transform = 'rotate(-20)';
        Transform['elementsToTransform'][0].getAttribute = jasmine.createSpy().and.returnValue(transform);

        Transform.translate(-10, -20);
        expect(transform).toBe('rotate(-20) translate(-10, -20)');
    });

    it('#translate should update translate property if transform property and only translate attribute exist (positive)', () => {
        transform = 'translate(5, 15)';
        Transform['elementsToTransform'][0].getAttribute = jasmine.createSpy().and.returnValue(transform);

        Transform.translate(10, 20);
        expect(transform).toBe('translate(15, 35)');
    });

    it('#translate should update translate property if transform property and translate/rotate attribute exist (positive)', () => {
        transform = 'translate(5, 15) rotate(-20)';
        Transform['elementsToTransform'][0].getAttribute = jasmine.createSpy().and.returnValue(transform);

        Transform.translate(10, 20);
        expect(transform).toBe('translate(15, 35) rotate(-20)');
    });

    it('#translate should update translate property if transform property and rotate/translate attribute exist (positive)', () => {
        transform = 'rotate(-20) translate(5, 15)';
        Transform['elementsToTransform'][0].getAttribute = jasmine.createSpy().and.returnValue(transform);

        Transform.translate(10, 20);
        expect(transform).toBe('rotate(-20) translate(15, 35)');
    });

    it('#translate should update translate property if transform property and only translate attribute exist (negative)', () => {
        transform = 'translate(5, 15)';
        Transform['elementsToTransform'][0].getAttribute = jasmine.createSpy().and.returnValue(transform);

        Transform.translate(-10, 20);
        expect(transform).toBe('translate(-5, 35)');
    });

    it('#translate should update translate property if transform property and translate/rotate attribute exist (negative)', () => {
        transform = 'translate(5, 15) rotate(-20)';
        Transform['elementsToTransform'][0].getAttribute = jasmine.createSpy().and.returnValue(transform);

        Transform.translate(-10, 20);
        expect(transform).toBe('translate(-5, 35) rotate(-20)');
    });

    it('#translate should update translate property if transform property and rotate/translate attribute exist (negative)', () => {
        transform = 'rotate(-20) translate(5, 15)';
        Transform['elementsToTransform'][0].getAttribute = jasmine.createSpy().and.returnValue(transform);

        Transform.translate(10, -20);
        expect(transform).toBe('rotate(-20) translate(15, -5)');
    });

    it('#translate should trigger observable on each translate', () => {
        Transform['elementsToTransform'][0].getAttribute = jasmine.createSpy().and.returnValue(transform);

        Transform.needsUpdate.next(false);
        Transform.translate(10, 10);
        expect(Transform.needsUpdate.getValue()).toBe(true);
    });
});
