import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { ElementRef, NO_ERRORS_SCHEMA, Renderer2, Type } from '@angular/core';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { RectangleService } from 'src/app/services/index/drawable/rectangle/rectangle.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { RectangleComponent } from './rectangle.component';
import { BehaviorSubject } from 'rxjs';
import { Color } from 'src/app/classes/color';

describe('RectangleComponent', () => {
  let component: RectangleComponent;
  let fixture: ComponentFixture<RectangleComponent>;
  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RectangleComponent ],
      providers: [
        {
          provide: RectangleService,
          useValue: {
            initializeProperties: () => { return ; },
            initialize: () => null
          }
        },
        {
          provide: Renderer2,
          useValue: {
            createElement: () => mockedRendered,
            setAttribute: () => mockedRendered,
            appendChild: () => mockedRendered,
            removeChild: () => mockedRendered,
          },
        },
        ToolSelectorService,
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
            },
          },
        },
        {
          provide: ColorSelectorService,
          useValue: {
            primaryColor: new BehaviorSubject<Color>(new Color('#FFFFFF')),
            secondaryColor: new BehaviorSubject<Color>(new Color('#000000')),
            primaryTransparency: new BehaviorSubject<number>(0.5),
            secondaryTransparency: new BehaviorSubject<number>(0.8),
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(RectangleComponent);
    component = fixture.componentInstance;
    component['service']['manipulator'] = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    component['service'].colorSelectorService = component['colorSelectorService'];
    component.ngOnInit();
    expect(component['colorSelectorService'].primaryColor.value).toEqual(new Color('#FFFFFF'));
  });

  it('#ngOnDestroy should cancel on going shape', () => {
    const spy = spyOn(component['service'], 'cancelShapeIfOngoing');
    component.updateBorder();
    expect(spy).toHaveBeenCalled();
  });

  it('#updateBorder should update tracing type to border', () => {
    const spy = spyOn(component['service'], 'updateTracingType');
    component.updateBorder();
    expect(spy).toHaveBeenCalledWith('border');
  });

  it('#updateFill should update tracing type to fill', () => {
    const spy = spyOn(component['service'], 'updateTracingType');
    component.updateFill();
    expect(spy).toHaveBeenCalledWith('fill');
  });
});
