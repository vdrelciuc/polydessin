import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { LineComponent } from './line.component';
import { DrawablePropertiesService } from 'src/app/services/index/drawable/properties/drawable-properties.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatSliderModule, MatOptionModule, MatSelectModule, MatInputModule, MatSlideToggleModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LineService } from 'src/app/services/index/drawable/line/line.service';
import { HotkeysService } from 'src/app/services/events/shortcuts/hotkeys.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { Renderer2, Type } from '@angular/core';

describe('LineComponent', () => {
  let component: LineComponent;
  let fixture: ComponentFixture<LineComponent>
  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineComponent ],
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
        LineService,
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
    fixture = TestBed.createComponent(LineComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    component['service']['manipulator'] = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#setupShortcuts should setup shortcuts', () => {
    let spy = spyOn(component['service'], 'removeLastPoint');
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'backspace', 
      bubbles: true
    }));
    let spy2 = spyOn(component['service'], 'getLineIsDone');
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'escape', 
      bubbles: true
    }));
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('#setupShortcuts should try shortcuts with line is done', () => {
    let spy = spyOn(component['service'], 'deleteLine');
    component['service']['isDone'] = false;
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'escape', 
      bubbles: true
    }));
    expect(spy).toHaveBeenCalled();
  });
});
