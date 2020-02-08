import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineComponent } from './line.component';
import { DrawablePropertiesService } from 'src/app/services/index/drawable/properties/drawable-properties.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatSliderModule, MatOptionModule, MatSelectModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LineService } from 'src/app/services/index/drawable/line/line.service';
import { HotkeysService } from 'src/app/services/events/shortcuts/hotkeys.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';

describe('LineComponent', () => {
  let component: LineComponent;
  let fixture: ComponentFixture<LineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineComponent ],
      providers: [
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
        MatInputModule
      ]
    })
    .compileComponents();  

    fixture = TestBed.createComponent(LineComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setup shortcuts', () => {
    component.setupShortcuts();
    let spy = spyOn(TestBed.get<LineService>(LineService), 'removeLastPoint');
    document.dispatchEvent(new KeyboardEvent('backspace', {}));
    document.dispatchEvent(new Event('keydown.backspace'));
    expect(spy).toHaveBeenCalled();
  });
});
