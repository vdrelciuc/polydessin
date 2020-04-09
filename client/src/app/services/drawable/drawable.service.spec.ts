import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { Color } from 'src/app/classes/color';
import { ColorSelectorService } from '../color-selector/color-selector.service';
import { DrawStackService } from '../draw-stack/draw-stack.service';
import { DrawableService } from '../drawable/drawable.service';
import { LineService } from './line/line.service';

describe('DrawableService', () => {

  let service: DrawableService;
  let lineService: LineService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(DrawableService);
    lineService = new LineService();
    lineService.initialize(
      {
        appendChild: () => '0',
        setAttribute: () => null,
      } as unknown as Renderer2,
      {
        nativeElement: {
          getBoundingClientRect: () => new DOMRect(1, 1, 1, 1),
          getAttribute: () => '1',
          cloneNode: () => 'bla' as unknown as SVGElement
        }
      } as unknown as ElementRef<SVGElement>,
      {
        primaryColor: new BehaviorSubject<Color>(new Color('#FFFFFF')),
        primaryTransparency: new BehaviorSubject<number>(1),
        secondaryColor: new BehaviorSubject<Color>(new Color('#FFFFFF')),
        secondaryTransparency: new BehaviorSubject<number>(1),
      } as unknown as ColorSelectorService,
      {
        getNextID: () => 1,
        addSVGWithNewElement: ()  => null,
        addElementWithInfos: () => null,
        isAdding: new BehaviorSubject<boolean>(true)
      } as unknown as DrawStackService
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#pushElement should be created', () => {
    lineService['isDone'] = false;
    lineService['isStarted'] = true;
    const spy = spyOn(lineService['drawStack'], 'getNextID').and.callFake( () => 1);
    const spy2 = spyOn(lineService['drawStack'], 'addSVGWithNewElement');
    lineService.onDoubleClick({
      clientX: 100,
      clientY: 100
    } as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith('bla' as unknown as SVGElement);
  });
});
