import { TestBed, getTestBed } from '@angular/core/testing';

import { TextService } from './text.service';
import { ElementRef, Renderer2, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Color } from 'src/app/classes/color';
import { CursorProperties } from 'src/app/classes/cursor-properties';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { TextAttributes } from 'src/app/interfaces/text-attributes';
import { CharacterFont } from 'src/app/enums/character-font';
import { Alignment } from 'src/app/enums/text-alignement';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { ColorSelectorService } from '../../color-selector/color-selector.service';

fdescribe('TextService', () => {

  let service: TextService;

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
            createElement: (p1: any, p2: string, p3?: any) => ({
              setAttributeNS: ()=> null
            }),
            setAttribute: () => mockedRendered,
            appendChild: () => mockedRendered,
            removeChild: () => mockedRendered,
          },
        },
        {
          provide: ElementRef,
          useValue: {
            nativeElement: {
              cloneNode: () => null,
              getBoundingClientRect: () => {
                const boundleft = 0;
                const boundtop = 0;
                const boundRect = {
                  left: boundleft,
                  top: boundtop,
                };
                return boundRect;
              },
            },
          },
        },
        {
          provide: ColorSelectorService,
          useValue: {
            primaryColor: new BehaviorSubject<Color>(new Color('#FFFFFF')),
          },
        },
        DrawStackService
      ],
    });
    service = TestBed.get(TextService);
    service.initialize(
      getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>),
      getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>),
      getTestBed().get<ColorSelectorService>(ColorSelectorService as Type<ColorSelectorService>),
      getTestBed().get<DrawStackService>(DrawStackService as Type<DrawStackService>)
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#onSelect should change cursor', () => {
    const spy = spyOn(service['manipulator'], 'setAttribute');
    service.onSelect();
    expect(spy).toHaveBeenCalledWith(service['image'].nativeElement, CursorProperties.cursor, CursorProperties.writing);
  });

  it('#endTool should reset cursor and push element', () => {
    const spy = spyOn(service['manipulator'], 'setAttribute');
    service['subElement'] = {
      id: 1
    } as unknown as SVGGElement;
    service.endTool();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(service['image'].nativeElement, CursorProperties.cursor, CursorProperties.default);
  });

  it('#endTool should reset cursor only', () => {
    const spy = spyOn(service['manipulator'], 'setAttribute');
    service['subElement'] = undefined as unknown as SVGGElement; 
    service.endTool();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(service['image'].nativeElement, CursorProperties.cursor, CursorProperties.default);
  });

  it('#onClick should setup svgtext', () => {
    const spy = spyOn(service['manipulator'], 'setAttribute');
    service.onClick(new MouseEvent('click', {
      clientX: 500,
      clientY: 500
    }));
    expect(spy).toHaveBeenCalledTimes(7);
    expect(service['clickPosition']).toEqual(new CoordinatesXY(500,518));
  });

  it('#onClick should setup new svgtext and push old one', () => {
    service['subElement'] = { id: 10 } as unknown as SVGGElement;
    const spy = spyOn(service['manipulator'], 'setAttribute');
    service.onClick(new MouseEvent('click', {
      clientX: 500,
      clientY: 500
    }));
    expect(spy).toHaveBeenCalledTimes(8);
    expect(service['clickPosition']).toEqual(new CoordinatesXY(500,518));
  });

  it('#onKeyPressed should do nothing, key is bypassed', () => {
    service['currentTextbox'] = { innerHTML: '1'} as unknown as SVGTextElement;
    service.onKeyPressed(new KeyboardEvent('keypress', {
      key: 'Control'
    }));
    expect(service['currentTextbox'].innerHTML).toEqual('1');
  });

  it('#onKeyPressed should append character', () => {
    service['currentTextbox'] = { innerHTML: '1|'} as unknown as SVGTextElement;
    service.onKeyPressed(new KeyboardEvent('keypress', {
      key: 'a'
    }));
    expect(service['currentTextbox'].innerHTML).toEqual('1a|');
  });

  it('#onKeyPressed should not append character, element undefined', () => {
    service['currentTextbox'] = undefined as unknown as SVGTextElement;
    service.onKeyPressed(new KeyboardEvent('keypress', {
      key: 'a'
    }));
    expect(service['currentTextbox']).toEqual(undefined as unknown as SVGTextElement);
  });

  it('#changeAlignment should align to the left', () => {
    const target = {innerHTML: '   blabla'} as unknown as SVGTextElement;
    service['textBoxes'].set(0, {innerHTML: '   bla'} as unknown as SVGTextElement);
    service['textBoxes'].set(1, target);
    service.changeAlignment(Alignment.Left);
    expect((service['textBoxes'].get(1) as SVGTextElement).innerHTML).toEqual('blabla');
    expect((service['textBoxes'].get(0) as SVGTextElement).innerHTML).toEqual('bla');
  });

  it('#changeAlignment should align to the middle', () => {
    const target = {innerHTML: 'blabla|'} as unknown as SVGTextElement;
    service['currentTextbox'] = target;
    service['textBoxes'].set(0, {innerHTML: 'bla'} as unknown as SVGTextElement);
    service['textBoxes'].set(1, target);
    service.changeAlignment(Alignment.Center);
    expect((service['textBoxes'].get(1) as SVGTextElement).innerHTML).toEqual('blabla| ');
    expect((service['textBoxes'].get(0) as SVGTextElement).innerHTML).toEqual('  bla  ');
  });

  it('#changeAlignment should align to the right', () => {
    const target = {innerHTML: 'blabla|'} as unknown as SVGTextElement;
    service['currentTextbox'] = target;
    service['textBoxes'].set(0, {innerHTML: 'bla'} as unknown as SVGTextElement);
    service['textBoxes'].set(1, target);
    service.changeAlignment(Alignment.Right);
    expect((service['textBoxes'].get(1) as SVGTextElement).innerHTML).toEqual(' blabla|');
    expect((service['textBoxes'].get(0) as SVGTextElement).innerHTML).toEqual('    bla');
  });

  it('#cancel should cancel svg text', () => {
    service['subElement'] = {remove: () => null} as unknown as SVGGElement;
    const spy = spyOn(service['subElement'], 'remove');
    let testMap = new Map<number, SVGTextElement>();
    testMap.set(0, { innerHTML: 'test0', remove: () => null } as unknown as SVGTextElement);
    testMap.set(1, { innerHTML: 'test1', remove: () => null } as unknown as SVGTextElement);
    service['textBoxes'] = testMap;
    service.cancel();
    expect(spy).toHaveBeenCalled();
    expect(service['textBoxes'].size).toEqual(0);
  });
  
  it('#delete should remove next character', () => {
    service['currentTextbox'] = { innerHTML: '1|a'} as unknown as SVGTextElement;
    service['maxSize'] = {
      size: 4,
      target: service['currentTextbox']
    };
    service['textBoxes'].set(0, service['currentTextbox']);
    service.delete();
    expect(service['currentTextbox'].innerHTML).toEqual('1|');
  }); 

  it('#delete should remove next from largest textbox', () => {
    service['currentTextbox'] = { innerHTML: '1|a'} as unknown as SVGTextElement;
    service.delete();
    expect(service['currentTextbox'].innerHTML).toEqual('1|');
  }); 

  it('#delete should do nothing current position is the last character', () => {
    service['currentTextbox'] = { innerHTML: '1|'} as unknown as SVGTextElement;
    service.delete();
    expect(service['currentTextbox'].innerHTML).toEqual('1|');
  }); 

  it('#backspace should remove previous character', () => {
    service['currentTextbox'] = { innerHTML: '1ba|'} as unknown as SVGTextElement;
    service.backspace();
    expect(service['currentTextbox'].innerHTML).toEqual('1b|');
  }); 

  it('#backspace should remove previous character from largest box', () => {
    service['currentTextbox'] = { innerHTML: '1ba|'} as unknown as SVGTextElement;
    service['maxSize'] = {
      size: 4,
      target: service['currentTextbox']
    };
    service['textBoxes'].set(0, service['currentTextbox']);
    const spy = spyOn(service, 'changeAlignment');
    service.backspace();
    expect(spy).toHaveBeenCalled();
    expect(service['currentTextbox'].innerHTML).toEqual('1b|');
  }); 

  it('#backspace should remove enter and go to previous text box', () => {
    service['clickPosition'] = new CoordinatesXY(100, 100);
    const text0 = { innerHTML: 'box0'} as unknown as SVGTextElement;
    const text1 = { innerHTML: '|', remove: () => null} as unknown as SVGTextElement;
    service['textBoxes'].set(0, text0);
    service['textBoxes'].set(1, text1);
    service['currentBoxNumber'] = 2;
    service['currentTextbox'] = text1;
    service.backspace();
    expect(service['currentTextbox'].innerHTML).toEqual('box0|');
  }); 

  it('#backspace should do nothing, first box and is empty', () => {
    service['clickPosition'] = new CoordinatesXY(100, 100);
    const text1 = { innerHTML: '|', remove: () => null} as unknown as SVGTextElement;
    service['textBoxes'].set(0, text1);
    service['currentBoxNumber'] = 1;
    service['currentTextbox'] = text1;
    service.backspace();
    expect(service['currentTextbox'].innerHTML).toEqual('|');
  }); 

  it('#moveLeft should move current position one index to the left', () => {
    service['currentTextbox'] = { innerHTML: '1ba|'} as unknown as SVGTextElement;
    service.moveLeft();
    expect(service['currentTextbox'].innerHTML).toEqual('1b|a');
  });

  it('#moveLeft should do nothing, current position is the first position of the first box', () => {
    service['currentTextbox'] = { innerHTML: '|aba'} as unknown as SVGTextElement;
    service['currentBoxNumber'] = 1;
    service.moveLeft();
    expect(service['currentTextbox'].innerHTML).toEqual('|aba');
  });

  it('#moveLeft should go to previous box', () => {
    const text0 = { innerHTML: 'box0'} as unknown as SVGTextElement;
    const text1 = { innerHTML: '|aba'} as unknown as SVGTextElement;
    service['textBoxes'].set(0, text0);
    service['textBoxes'].set(1, text1);
    service['currentBoxNumber'] = 2;
    service['currentTextbox'] = text1;
    service.moveLeft();
    expect(service['currentTextbox'].innerHTML).toEqual('box0|');
    expect((service['textBoxes'].get(1) as SVGTextElement).innerHTML).toEqual('aba');
  });

  it('#moveRight should move current position one index to the right', () => {
    service['currentTextbox'] = { innerHTML: '1ba|aa'} as unknown as SVGTextElement;
    service.moveRight();
    expect(service['currentTextbox'].innerHTML).toEqual('1baa|a');
  });

  it('#moveRight should do nothing, current position is the last position of the last box', () => {
    service['currentTextbox'] = { innerHTML: '1ba|'} as unknown as SVGTextElement;
    service['currentBoxNumber'] = 1;
    service.moveRight();
    expect(service['currentTextbox'].innerHTML).toEqual('1ba|');
  });

  it('#moveRight should go to next box', () => {
    const text0 = { innerHTML: 'box0|'} as unknown as SVGTextElement;
    const text1 = { innerHTML: 'aba'} as unknown as SVGTextElement;
    service['textBoxes'].set(0, text0);
    service['textBoxes'].set(1, text1);
    service['currentBoxNumber'] = 1;
    service['currentTextbox'] = text0;
    service.moveRight();
    expect(service['currentTextbox'].innerHTML).toEqual('|aba');
    expect((service['textBoxes'].get(0) as SVGTextElement).innerHTML).toEqual('box0');
  });


  it('#createCurrentTextBox should create a new textbox on the click position', () => {
    service['clickPosition'] = new CoordinatesXY(100, 100);
    service['properties'] = new BehaviorSubject<TextAttributes>({
      size: 12,
      font: CharacterFont.C,
      isItalic: true,
      isBold: true,
      alignment: Alignment.Center
    });
    const spy = spyOn(service['manipulator'], 'setAttribute');
    service.createCurrentTextBox();
    expect(spy).toHaveBeenCalledTimes(7);
    expect(service['currentBoxNumber']).toEqual(1);
    expect(service['clickPosition'].getX()).toEqual(100);
    expect(service['clickPosition'].getY()).toEqual(118);
  });

  it('#toLeft should return largest textbox size', () => {
    service['textBoxes'].set(0, {innerHTML: '  bla'} as unknown as SVGTextElement);
    expect((service['textBoxes'].get(0) as SVGTextElement).innerHTML.length).toEqual(5);
    service['toLeft']();
    expect((service['textBoxes'].get(0) as SVGTextElement).innerHTML.length).toEqual(3);
  });

  it('#findSizeOfLargestTextbox should remove spaces to the left', () => {
    const target = {innerHTML: 'blabla'} as unknown as SVGTextElement;
    service['textBoxes'].set(0, {innerHTML: 'bla'} as unknown as SVGTextElement);
    service['textBoxes'].set(1, target);
    service['findSizeOfLargestTextbox']();
    expect(service['maxSize'].target).toEqual(target);
    expect(service['maxSize'].size).toEqual(6);
  });
});
