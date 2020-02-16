import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { EllipseComponent } from './ellipse.component';
import { Renderer2, Type } from '@angular/core';
import { HotkeysService } from 'src/app/services/events/shortcuts/hotkeys.service';
import { EllipseService } from 'src/app/services/index/drawable/ellipse/ellipse.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { DrawablePropertiesService } from 'src/app/services/index/drawable/properties/drawable-properties.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatSliderModule, MatFormFieldModule, MatOptionModule, MatSelectModule, MatInputModule, MatSlideToggleModule } from '@angular/material';

describe('EllipseComponent', () => {
  let component: EllipseComponent;
  let fixture: ComponentFixture<EllipseComponent>;
  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  }

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
});
