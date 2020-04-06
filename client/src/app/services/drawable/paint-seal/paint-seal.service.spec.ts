import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { BFSAlgorithm } from 'src/app/classes/bfs-algorithm';
import { Color } from 'src/app/classes/color';
import * as CONSTANTS from 'src/app/classes/constants';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { ColorSelectorService } from '../../color-selector/color-selector.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { PipetteService } from '../../pipette/pipette.service';
import { PaintSealService } from './paint-seal.service';

describe('PaintSealService', () => {

  let service: PaintSealService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;

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
              createElement: () => null,
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
                clientHeight: 100,
                cloneNode: () => null,
            },
          },
        },
        {
          provide: ColorSelectorService,
          useValue: {
            primaryColor: new BehaviorSubject<Color>(new Color('#FFFFFF')),
            primaryTransparency: new BehaviorSubject<number>(1),
          },
        },
      ],
    });
    service = TestBed.get(PaintSealService);
    manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
    image = getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>);
    service.initialize(manipulator, image,
      getTestBed().get<ColorSelectorService>(ColorSelectorService as Type<ColorSelectorService>),
      getTestBed().get(DrawStackService)
    );
    service.assignPipette(
      {
        getColorAtPosition: () => '#FFFFFF',
        hiddenCanvas: {
          getContext: () => ({
            getImageData: () => ({
              data: []
            })
          })
        }
      } as unknown as PipetteService
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set default properties', () => {
    expect(service.tolerance.value).toEqual(CONSTANTS.VISUAL_DIFFERENCE);
  });

  it('#onSelect should setup', () => {
    const spy = spyOn(service['pipette'], 'getColorAtPosition').and.callFake( () => null);
    service.onSelect();
    expect(spy).toHaveBeenCalled();
  });

  it('#endTool should restor cursor to normal shape', () => {
    const spy = spyOn(service['manipulator'], 'setAttribute');
    service.endTool();
    expect(spy).toHaveBeenCalled();
  });

  it('#endTool should restore cursor to normal shape', () => {
    service.onMousePress({} as unknown as MouseEvent);
    expect(service['mouseDown']).toEqual(true);
  });

  it('#onClick should do nothing, mouse is not down', () => {
    service['mouseDown'] = false;
    service.onClick({} as unknown as MouseEvent);
    expect(service['algorithm']).toEqual(undefined as unknown as BFSAlgorithm);
  });

  it('#onClick should find and draw', () => {
    service['mouseDown'] = true;
    const spy = spyOn(service['manipulator'], 'setAttribute');
    service.onClick({
      clientX: 100,
      clientY: 100,
    } as unknown as MouseEvent);
    expect(service['mouseDown']).toEqual(false);
    expect(spy).toHaveBeenCalledTimes(8);
    expect(spy).toHaveBeenCalledWith(null, SVGProperties.d, '');
    expect(service['algorithm']).not.toEqual(undefined as unknown as BFSAlgorithm);
  });

  it('#generatePathDefinition should generate a path defintion attribute', () => {
    service['algorithm'] = {
      pathsToFill: [
        [ new CoordinatesXY(100, 100), new CoordinatesXY(400, 400), new CoordinatesXY(200, 200)],
        [ ]
      ]
    } as unknown as BFSAlgorithm;
    const ret = service['generatePathDefinition']();
    expect(ret).toEqual(' M100.5 100.5 L400.5 400.5 L200.5 200.5 z z');
  });

  it('#generatePathDefinition should return empty defintion attribute', () => {
    service['algorithm'] = {
      pathsToFill: undefined
    } as unknown as BFSAlgorithm;
    const ret = service['generatePathDefinition']();
    expect(ret).toEqual('');
  });
});
