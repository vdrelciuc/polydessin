import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog, MatSnackBarModule, MatTooltipModule } from '@angular/material';
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
            afterColsed: ()  => null,
            closeAll: () => null
          }
        },
        {provide: APP_BASE_HREF, useValue : '/' }
      ],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
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

  it('#selectTool should select current tool', () => {
    component.selectTool(Tools.Line);
    expect(selector.$currentTool.value).toEqual(Tools.Line);
  });

  it('#openDialog should open dialog', () => {
    const spy = spyOn(component['dialog'], 'open');
    component.openUserGuide();
    expect(spy).toHaveBeenCalled();
  });
});
