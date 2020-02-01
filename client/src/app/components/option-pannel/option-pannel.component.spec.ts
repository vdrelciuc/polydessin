import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { OptionPannelComponent } from './option-pannel.component';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { DrawerService } from 'src/app/services/side-nav-drawer/drawer.service';
import { BehaviorSubject } from 'rxjs';
import { Tools } from 'src/app/enums/tools';

describe('OptionPannelComponent', () => {
  let component: OptionPannelComponent;
  let fixture: ComponentFixture<OptionPannelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ OptionPannelComponent,
      {
        provide: ToolSelectorService,
        useValue: {
          drawerService: () => new DrawerService(),
          $currentTool: () => new BehaviorSubject<Tools>(Tools.Line),
        },
      }]
    });
    component = getTestBed().get(OptionPannelComponent);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionPannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to tool', () => {
    expect(component).toBeTruthy();
  });
});
