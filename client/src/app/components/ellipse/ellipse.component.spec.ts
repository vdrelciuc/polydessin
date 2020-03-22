import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';

import { Renderer2, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatSliderModule, MatSlideToggleModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HotkeysService } from 'src/app/services/events/shortcuts/hotkeys.service';
import { EllipseService } from 'src/app/services/index/drawable/ellipse/ellipse.service';
import { DrawablePropertiesService } from 'src/app/services/index/drawable/properties/drawable-properties.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { EllipseComponent } from './ellipse.component';

describe('EllipseComponent', () => {
  let component: EllipseComponent;
  let fixture: ComponentFixture<EllipseComponent>;
  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EllipseComponent ],
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
        HotkeysService,
        EllipseService,
        ToolSelectorService,
        DrawablePropertiesService
      ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatSliderModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        MatInputModule,
        MatSlideToggleModule,
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(EllipseComponent);
    component = fixture.componentInstance;
    component['service']['manipulator'] = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should init properties', () => {
    const spy = spyOn(component['service'], 'initializeProperties');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('#ngOnDestroy should cancel ongoing shape', () => {
    const spy = spyOn(component['service'], 'cancelShapeIfOngoing');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('#updateBorder should update tracing type', () => {
    const spy = spyOn(component['service'], 'updateTracingType');
    component.updateBorder();
    expect(spy).toHaveBeenCalledWith('border');
  });

  it('#updateFill should update tracing type', () => {
    const spy = spyOn(component['service'], 'updateTracingType');
    component.updateFill();
    expect(spy).toHaveBeenCalledWith('fill');
  });
});
