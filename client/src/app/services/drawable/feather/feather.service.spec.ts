// import { TestBed, getTestBed } from '@angular/core/testing';

// import { FeatherService } from './feather.service';
// import { BehaviorSubject } from 'rxjs';
// import { Color } from 'src/app/classes/color';
// import { ElementRef, Renderer2, Type } from '@angular/core';
// import { ColorSelectorService } from '../../color-selector/color-selector.service';
// import { DrawStackService } from '../../draw-stack/draw-stack.service';
// import { SVGProperties } from 'src/app/classes/svg-html-properties';

// describe('FeatherService', () => {

//   let service: FeatherService;
//   const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
//     const element = new Element();
//     parentElement.children.push(element);
//     return element;
//   };

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         {
//           provide: Renderer2,
//           useValue: {
//             createElement: () => ({
//               cloneNode: () => null
//             }),
//             setAttribute: () => mockedRendered,
//             appendChild: () => mockedRendered,
//             removeChild: () => mockedRendered,
//           },
//         },
//         {
//           provide: ElementRef,
//           useValue: {
//             nativeElement: {
//               cloneNode: () => null,
//               getBoundingClientRect: () => {
//                 const boundleft = 0;
//                 const boundtop = 0;
//                 const boundRect = {
//                   left: boundleft,
//                   top: boundtop,
//                 };
//                 return boundRect;
//               },
//             },
//           },
//         },
//         {
//           provide: ColorSelectorService,
//           useValue: {
//             primaryColor: new BehaviorSubject<Color>(new Color('#FFFFFF')),
//           },
//         },
//         DrawStackService
//       ],
//     });
//     service = TestBed.get(FeatherService);
//     service.initialize(
//       getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>),
//       getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>),
//       getTestBed().get<ColorSelectorService>(ColorSelectorService as Type<ColorSelectorService>),
//       getTestBed().get<DrawStackService>(DrawStackService as Type<DrawStackService>)
//     );
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('#onSelect should init subElement', () => {
//     const spy = spyOn(service['manipulator'], 'createElement');
//     service.onSelect();
//     expect(spy).toHaveBeenCalledWith(SVGProperties.g, SVGProperties.nameSpace);
//   });

//   it('#endTool should remove preview and unfinished element', () => {
//     service['preview'] = { remove: () => null} as unknown as SVGLineElement;
//     service['subElement'] = { remove: () => null} as unknown as SVGGElement;
//     const spy1 = spyOn(service['preview'], 'remove');
//     const spy2 = spyOn(service['subElement'], 'remove');
//     service.endTool();
//     expect(spy1).toHaveBeenCalled();
//     expect(spy2).toHaveBeenCalled();
//   });

//   it('#endTool should remove preview and subElement', () => {
//     service['preview'] =    undefined as unknown as SVGLineElement;
//     service['subElement'] = undefined as unknown as SVGGElement;
//     service.endTool();
//   });

//   it('#onMouseOutCanvas should stop drawing and remove previeiw', () => {
//     service['canDraw'] = true;
//     service['preview'] = { remove: () => null} as unknown as SVGLineElement;
//     const spy = spyOn(service['preview'], 'remove');
//     service.onMouseOutCanvas({} as unknown as MouseEvent);
//     expect(spy).toHaveBeenCalled();
//     expect(service['canDraw']).toEqual(false);
//   });

//   it('#onMouseInCanvas should create preview', () => {
//     const spy = spyOn(service['manipulator'], 'createElement');
//     service.onMouseInCanvas({} as unknown as MouseEvent);
//     expect(spy).toHaveBeenCalledWith(SVGProperties.line, SVGProperties.nameSpace);
//   });

//   it('#onMousePress should enable drawing and create subeleemnt', () => {
//     service['canDraw'] = false;
//     const spy = spyOn(service['manipulator'], 'createElement');
//     service.onMousePress({button: 0} as unknown as MouseEvent);
//     expect(spy).toHaveBeenCalledWith(SVGProperties.g, SVGProperties.nameSpace);
//     service['canDraw'] = true;
//   });

//   it('#onMousePress should not enable drawing, not left click', () => {
//     service['canDraw'] = false;
//     service.onMousePress({button: 1} as unknown as MouseEvent);
//     service['canDraw'] = false;
//   });

//   it('#onMouseMove should only update preview', () => {
//     service['canDraw'] = false;
//     const spy = spyOn(service['manipulator'], 'setAttribute');
//     const spy2 = spyOn(service['manipulator'], 'appendChild');
//     service.onMouseMove({clientX: 100, clientY: 100} as unknown as MouseEvent);
//     expect(spy).toHaveBeenCalledTimes(6);
//     expect(spy2).toHaveBeenCalledTimes(1);
//   });

//   it('#onMouseMove should update preview and draw', () => {
//     service['canDraw'] = true;
//     const spy = spyOn(service['manipulator'], 'setAttribute');
//     const spy2 = spyOn(service['manipulator'], 'appendChild');
//     service.onMouseMove({clientX: 100, clientY: 100} as unknown as MouseEvent);
//     expect(spy).toHaveBeenCalledTimes(6);
//     expect(spy2).toHaveBeenCalledTimes(2);
//   });

//   it('#onMouseRelease should stop drawing and push drawing', () => {
//     service['canDraw'] = true;
//     service['preview'] = {remove: () => null, cloneNode: () => null} as unknown as SVGLineElement;
//     service['subElement'] = {childElementCount: 4} as unknown as SVGGElement;
//     const spy = spyOn(service['preview'], 'remove');
//     const spy2 = spyOn(service['drawStack'], 'addElementWithInfos');
//     service.onMouseRelease({clientX: 100, clientY: 100} as unknown as MouseEvent);
//     expect(spy).toHaveBeenCalled();
//     expect(spy2).toHaveBeenCalled();
//     expect(service['canDraw']).toEqual(false);
//   });

//   it('#onMouseRelease should stop drawing and push drawing', () => {
//     service['canDraw'] = true;
//     service['preview'] = {remove: () => null, cloneNode: () => null} as unknown as SVGLineElement;
//     service['subElement'] = {childElementCount: 0} as unknown as SVGGElement;
//     const spy = spyOn(service['preview'], 'remove');
//     const spy2 = spyOn(service['drawStack'], 'addElementWithInfos');
//     service.onMouseRelease({clientX: 100, clientY: 100} as unknown as MouseEvent);
//     expect(spy).toHaveBeenCalled();
//     expect(spy2).not.toHaveBeenCalled();
//     expect(service['canDraw']).toEqual(false);
//   });

//   it('#onKeyPress should change alt state', () => {
//     service['altPressed'] = false;
//     service.onKeyPressed({key: 'Alt'} as unknown as KeyboardEvent);
//     expect(service['altPressed']).toEqual(true);
//   });

//   it('#onKeyPress should not change alt state', () => {
//     service['altPressed'] = false;
//     service.onKeyPressed({key: 'Shift'} as unknown as KeyboardEvent);
//     expect(service['altPressed']).toEqual(false);
//   });

//   it('#onKeyReleased should change alt state', () => {
//     service['altPressed'] = true;
//     service.onKeyReleased({key: 'Alt'} as unknown as KeyboardEvent);
//     expect(service['altPressed']).toEqual(false);
//   });

//   it('#onKeyReleased should not change alt state', () => {
//     service['altPressed'] = true;
//     service.onKeyReleased({key: 'Shift'} as unknown as KeyboardEvent);
//     expect(service['altPressed']).toEqual(true);
//   });

//   it('#onMouseWheel should increment by 15', () => {
//     service['altPressed'] = false;
//     service.onMouseWheel({deltaY: -1} as unknown as WheelEvent);
//     expect(service.angle.value).toEqual(15);
//   });

//   it('#onMouseWheel should decrement by 15', () => {
//     service['altPressed'] = false;
//     service.onMouseWheel({deltaY: 1} as unknown as WheelEvent);
//     expect(service.angle.value).toEqual(345);
//   });

//   it('#onMouseWheel should increment by 1', () => {
//     service['altPressed'] = true;
//     service.onMouseWheel({deltaY: -1} as unknown as WheelEvent);
//     expect(service.angle.value).toEqual(1);
//   });

//   it('#onMouseWheel should decrement by 1', () => {
//     service['altPressed'] = true;
//     service.onMouseWheel({deltaY: 1} as unknown as WheelEvent);
//     expect(service.angle.value).toEqual(359);
//   });

//   it('#onMouseWheel should increment by 1', () => {
//     service['altPressed'] = true;
//     service.angle.next(360);
//     service.onMouseWheel({deltaY: -1} as unknown as WheelEvent);
//     expect(service.angle.value).toEqual(1);
//   });

//   it('#onMouseWheel should decrement by 1', () => {
//     service['altPressed'] = true;
//     service.angle.next(360);
//     service.onMouseWheel({deltaY: 1} as unknown as WheelEvent);
//     expect(service.angle.value).toEqual(359);
//   });
// });
