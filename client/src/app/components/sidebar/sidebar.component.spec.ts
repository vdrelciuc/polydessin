import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialog } from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Tools } from 'src/app/enums/tools';
import { HotkeysService } from 'src/app/services/events/shortcuts/hotkeys.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
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
          useValue: {
            open: () => null,
            afterColsed: ()  => null
          }
        },
      ],
      imports: [
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

  it('#setupShortcuts should setup shortcuts', () => {
    component.setupShortcuts();
    const spy = spyOn(selector, 'setCurrentTool');
    const spy2 = spyOn(component, 'createNewProject');
    const keys = ['l','c', '1', 'w', 'control.o'];
    for(const element of keys) {
      document.dispatchEvent(new KeyboardEvent('keydown', {
        key: element,
        bubbles: true
      }));
    }
    expect(spy).toHaveBeenCalledTimes(component['subscriptions'].length - 2);
    expect(spy2).toHaveBeenCalled();
  });

  it('#selectTool should select current tool', () => {
    component.selectTool(Tools.Line);
    expect(selector.$currentTool.value).toEqual(Tools.Line);
    expect(component['subscriptions'].length).toEqual(5);
  });

  // it('#createNewProject should  stop shortcuts and create dialog ', () => {
  //   component.createNewProject();
  //   expect(component['subscriptions'].length).toEqual(0);
  //   expect(component['createNewDialog']).toBeTruthy();
  // });
});
