import { Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule,
  MatSliderModule, MatSlideToggleModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HotkeysService } from 'src/app/services/hotkeys/hotkeys.service';
import { LineService } from 'src/app/services/drawable/line/line.service';
import { DrawablePropertiesService } from 'src/app/services/drawable/properties/drawable-properties.service';
import { ToolSelectorService } from 'src/app/services/tools-selector/tool-selector.service';
import { LineComponent } from './line.component';

describe('LineComponent', () => {
  let component: LineComponent;
  let fixture: ComponentFixture<LineComponent>;
  // tslint:disable-next-line: no-any | Reason : parentElement: Element creates an issue
  const mockedRendered = (parentElement: any, name: string, debugInfo?: string): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  };

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
    const spy = spyOn(component['service'], 'removeLastPoint');
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'backspace',
      bubbles: true
    }));
    const spy2 = spyOn(component['service'], 'getLineIsDone');
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'escape',
      bubbles: true
    }));
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('#setupShortcuts should try shortcuts with line is not done', () => {
    const spy = spyOn(component['service'], 'deleteLine');
    component['service']['isDone'] = false;
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'escape',
      bubbles: true
    }));
    expect(spy).toHaveBeenCalled();
  });

  it('#setupShortcuts should try shortcuts with line is done', () => {
    const spy = spyOn(component['service'], 'deleteLine');
    component['service']['isDone'] = true;
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'escape',
      bubbles: true
    }));
    expect(spy).not.toHaveBeenCalled();
  });

  it('#updateJunctionType should update junction type', () => {
    component['service'].jointIsDot = false;
    component.updateJunctionType();
    expect(component['service'].jointIsDot).toEqual(true);
  });
});
