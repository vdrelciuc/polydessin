import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialog, MatTooltipModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Tools } from 'src/app/enums/tools';
import { Tools } from 'src/app/enums/tools';
import { HotkeysService } from 'src/app/services/events/shortcuts/hotkeys.service';
import { HotkeysService } from 'src/app/services/events/shortcuts/hotkeys.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { SidebarComponent } from './sidebar.component';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let selector: ToolSelectorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarComponent ],
      providers: [
        ToolSelectorService,
        HotkeysService,
        {
          provide: MatDialog,
          useValue: {}
        },
      ],
      imports: [
        MatTooltipModule,
        RouterModule.forRoot(
          [
            { path: '', component: SidebarComponent}
          ]
        )
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    selector = TestBed.get<ToolSelectorService>(ToolSelectorService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    expect(component.currentTool).toEqual(Tools.Selection);
  });

  it('should setup shortcuts', () => {
    component.setupShortcuts();
    const spy = spyOn(selector, 'setCurrentTool');
    const element = fixture.debugElement.query(By.css('.wrapper'))
    element.triggerEventHandler('keydown', {
      key: 'l',
      bubbles: true
    });
    console.log(element);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should select current tool', () => {
    component.selectTool(Tools.Line);
    expect(selector.$currentTool.value).toEqual(Tools.Line);
  });
});
