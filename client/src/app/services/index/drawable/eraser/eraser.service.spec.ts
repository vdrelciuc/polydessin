import { TestBed, getTestBed } from '@angular/core/testing';

import { EraserService } from './eraser.service';
import { Renderer2, ElementRef, Type } from '@angular/core';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import * as CONSTANTS from '../../../../classes/constants';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { SVGElementInfos } from 'src/app/interfaces/svg-element-infos';
import { Stack } from 'src/app/classes/stack';
import { SVGProperties } from 'src/app/classes/svg-html-properties';

describe('EraserService', () => {
  let service: EraserService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;
  const mockedSVGInfo = {
    id: 1, 
    target: {
      firstChild: null,
      getBoundingClientRect: () => {
        const boundleft = 0;
        const boundtop = 0;
        const boundRect = {
            left: boundleft,
            top: boundtop,
        };
        return boundRect;
      },
      setAttribute: () => null,
      getAttribute: () => null,
      querySelectorAll: () => [],
      clientHeight: 100,
      cloneNode: () => null
    } as unknown as SVGGElement
  };

  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  };

  beforeEach(() => {
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
      {
        provide: ElementRef,
        useValue: {
            nativeElement: {
                getBoundingClientRect: () => {
                    const boundleft = 0;
                    const boundtop = 0;
                    const boundRect = {
                        left: boundleft,
                        top: boundtop,
                    };
                    return boundRect;
                },
                getAttribute: () => null,
                querySelectorAll: () => [
                  { 
                    getBoundingClientRect: () => {
                      const boundleft = 0;
                      const boundtop = 0;
                      const boundRect = {
                          left: boundleft,
                          top: boundtop,
                      };
                      return boundRect;
                    },
                    getAttribute: () => '2',
                    querySelectorAll: () => [],
                    clientHeight: 100,
                    onmouseover: null,
                    cloneNode: () => null,
                    parentElement: mockedSVGInfo.target
                  }, 
                  { 
                    getBoundingClientRect: () => {
                      const boundleft = 0;
                      const boundtop = 0;
                      const boundRect = {
                          left: boundleft,
                          top: boundtop,
                      };
                      return boundRect;
                    },
                    getAttribute: () => '1',
                    querySelectorAll: () => [],
                    clientHeight: 100,
                    onmouseover: null,
                    cloneNode: () => null,
                    parentElement: mockedSVGInfo.target
                  }
                ],
                clientHeight: 100,
                cloneNode: () => null,
                addEventListener: () => null,
                dispatchEvent: () => null,
                removeEventListener: () => null
            },
          },
        },
        ColorSelectorService,
        DrawStackService
      ],
    });
    service = TestBed.get(EraserService);
    manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
    image = getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>)
    service.initialize(manipulator, image, 
      getTestBed().get<ColorSelectorService>(ColorSelectorService as Type<ColorSelectorService>),
      getTestBed().get<DrawStackService>(DrawStackService as Type<DrawStackService>));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#initialize should be initialize element', () => {
    service['elements'] = new Stack<SVGElementInfos>();
    expect(service['elements'].getAll().length).toEqual(0);
    console.log('IN HERE');
    service.initialize(manipulator, image,
    getTestBed().get<ColorSelectorService>(ColorSelectorService as Type<ColorSelectorService>),
    getTestBed().get<DrawStackService>(DrawStackService as Type<DrawStackService>));
    console.log('DONE');
    expect(service['elements'].getAll().length).toEqual(2);
  });

  it('#initializeProperties should set default properties', () => {
    service.initializeProperties();
    expect(service.thickness.value).toEqual(CONSTANTS.THICKNESS_DEFAULT);
  });

  it('#initializeProperties should init subscriptions', () => {
    service.initializeProperties();
    service['preview'] = mockedSVGInfo.target as unknown as SVGRectElement;
    const spy = spyOn(manipulator, 'setAttribute');
    service.thickness.next(50);
    expect(spy).toHaveBeenCalledWith(service['preview'], SVGProperties.height, '50');
    expect(spy).toHaveBeenCalledWith(service['preview'], SVGProperties.width, '50');
  });

  it('#onMouseMove should not select', () => {
    service.onMouseOutCanvas();
    const spy = spyOn<any>(service, 'movePreview');
    service.onMouseMove({} as unknown as MouseEvent);
    expect(spy).not.toHaveBeenCalled();
  });


  it('#onMouseMove should change preview, but should not select', () => {
    service.onMouseInCanvas();
    expect(service['canErase']).toEqual(true);
    const spy = spyOn(manipulator, 'setAttribute');
    service.onMouseMove(new MouseEvent('mousemove', {clientX: 100, clientY: 100}));
    expect(service['selectedElement']).toEqual(undefined as unknown as SVGElementInfos);
    expect(spy).toHaveBeenCalledWith(
      service['preview'], 
      SVGProperties.x,
      (CoordinatesXY.effectiveX(image, 100) - service.thickness.value / 2).toString()
    );
    expect(spy).toHaveBeenCalledWith(
      service['preview'], 
      SVGProperties.y,
      (CoordinatesXY.effectiveY(image, 100) - service.thickness.value / 2).toString()
    );
  });


  it('#onMouseMove should change preview and select element', () => {
    service.onMouseInCanvas();
    service['selectedElement'] = mockedSVGInfo;
    const spy = spyOn<any>(service, 'movePreview');
    service.onMouseMove({
      clientX: 100,
      clientY: 100,
      target: {
        getBoundingClientRect: () => {
            const boundleft = 0;
            const boundtop = 0;
            const boundRect = {
                left: boundleft,
                top: boundtop,
            };
            return boundRect;
        },
        getAttribute: () => null,
        querySelectorAll: () => [],
        clientHeight: 100,
        cloneNode: () => null,
    } as unknown as SVGGElement
    } as any);
    expect(spy).toHaveBeenCalledWith(new CoordinatesXY(100, 100));
  });

  it('#onMouseOutCanvas should stop erasing', () => {
    expect(service['canErase']).toEqual(true);
    service.onMouseOutCanvas();
    expect(service['canErase']).toEqual(false);
  });

  it('#onMouseInCanvas should start erasing', () => {
    service['canErase'] = false;
    expect(service['canErase']).toEqual(false);
    service.onMouseInCanvas();
    expect(service['canErase']).toEqual(true);
  });

  it('#onClick should not remove, element is empty', () => {
    const spy = spyOn<any>(service, 'deleteSelectedElement');
    service.onClick({
      target: {
        getBoundingClientRect: () => {
            const boundleft = 1;
            const boundtop = 1;
            const boundRect = {
                left: boundleft,
                top: boundtop,
            };
            return boundRect;
        },
        getAttribute: () => null,
        querySelectorAll: () => [],
        clientHeight: 100,
        cloneNode: () => null,
    } as unknown as SVGGElement
    } as any);
    expect(spy).not.toHaveBeenCalled();
  });

  it('#onClick should not remove, element is current element', () => {
    const spy = spyOn<any>(service, 'deleteSelectedElement');
    service.onClick({
      target: {
        getBoundingClientRect: () => {
            const boundleft = 0;
            const boundtop = 0;
            const boundRect = {
                left: boundleft,
                top: boundtop,
            };
            return boundRect;
        },
        getAttribute: () => null,
        querySelectorAll: () => [],
        clientHeight: 100,
        cloneNode: () => null,
    } as unknown as SVGGElement
    } as any);
    expect(spy).not.toHaveBeenCalled();
  });

  it('#onClick should remove', () => {
    const spy = spyOn(manipulator, 'removeChild');
    service['thickness'].next(1);
    service['selectedElement'] = mockedSVGInfo;
    console.log('Watching here');
    service.onClick({
      clientX: 1,
      clientY: 10,
      target: {
        getBoundingClientRect: () => {
            const boundleft = 1;
            const boundtop = 1;
            const boundRect = {
                left: boundleft,
                top: boundtop,
                right: 100,
                bottom: 100
            };
            return boundRect;
        },
        getAttribute: () => 'black',
        querySelectorAll: () => [],
        clientHeight: 100,
        cloneNode: () => null,
    } as unknown as SVGGElement
    } as any);
    console.log('AFter watch')
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('#onMousePress should start removing elements', () => {
    service['leftClick'] = false;
    service.onMousePress(new MouseEvent('mousedown', {button: CONSTANTS.MOUSE_LEFT}));
    expect(service['brushDelete'].getAll().length).toEqual(0);
    expect(service['leftClick']).toBeTruthy();
  });

  it('#onMouseRelease should stop removing elements (none removed)', () => {
    service['leftClick'] = true;
    service['brushDelete'] = new Stack<SVGElementInfos>();
    service.onMouseRelease(new MouseEvent('mouseup', {button: CONSTANTS.MOUSE_LEFT}));
    expect(service['leftClick']).not.toBeTruthy();
  });

  it('#onMouseRelease should stop removing elements ', () => {
    service['brushDelete'] = new Stack<SVGElementInfos>();
    service['brushDelete'].push_back(mockedSVGInfo);
    service['leftClick'] = true;
    const spy = spyOn(service['drawStack'], 'addSVGToRedo');
    const spy2 = spyOn(service, 'onMouseMove');
    const event = new MouseEvent('mouseup', {
      button: CONSTANTS.MOUSE_LEFT,
      clientX: 100,
      clientY: 100
    });
    service.onMouseRelease(event);
    expect(service['leftClick']).not.toBeTruthy();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith(event);
  });

  it('#endTool should end the tool', () => {
    service['leftClick'] = true;
    service['selectedElement'] = mockedSVGInfo;
    const spy = spyOn(manipulator, 'setAttribute');
    service.endTool();
    expect(service['leftClick']).not.toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });

  it('#onSelect should init tool', () => {
    expect(service['elements'].getAll().length).toEqual(2);
    const spy = spyOn(manipulator, 'setAttribute');
    const spy2 = spyOn(manipulator, 'createElement');
    service.onSelect();
    expect(service['elements'].getAll().length).toEqual(2);
    expect(spy).toHaveBeenCalledWith(service['preview'], SVGProperties.width, CONSTANTS.THICKNESS_DEFAULT.toString() )
    expect(spy2).toHaveBeenCalledWith(SVGProperties.rectangle, 'http://www.w3.org/2000/svg');
  });

  it('#selectElement should select element first time', () => {
    const spy = spyOn<any>(service, 'getColor');
    const spy2 = spyOn<any>(service, 'setOutline');
    service.selectElement({
      getAttribute: () => '#FFFFFF',
    } as unknown as SVGGElement);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith('#8B0000');
  });

  it('#selectElement should select element different than the selected one', () => {
    service.selectElement({
      getAttribute: () => '#FFFFFF',
      firstChild: {
        getAttribute: () => '#000000'
      }
    } as unknown as SVGGElement);

    const spy = spyOn(manipulator, 'setAttribute');
    const spy2 = spyOn<any>(service, 'setOutline');
    service.selectElement({
      getAttribute: () => '#FFFFFB',
      firstChild: {
        getAttribute: () => '#00000B'
      }
    } as unknown as SVGGElement);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith('#8B0000');
  });

  it('#selectElement should select element different than the selected one with left click', () => {
    const spy = spyOn(manipulator, 'removeChild');
    service.onMousePress(new MouseEvent('mousepress', {button: 0}));
    service.selectElement({
      getAttribute: () => '#FFFFFF',
      firstChild: {
        getAttribute: () => '#000000'
      }
    } as unknown as SVGGElement);
    expect(service['brushDelete'].getAll().length).toEqual(1);
    service.selectElement({
      getAttribute: () => '#FFFFFB',
      firstChild: {
        getAttribute: () => '#00000B'
      }
    } as unknown as SVGGElement);
    expect(service['brushDelete'].getAll().length).toEqual(2);
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
