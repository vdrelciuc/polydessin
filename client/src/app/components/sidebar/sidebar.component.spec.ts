import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog, MatSnackBarModule, MatTooltipModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { Tools } from 'src/app/enums/tools';
import { HotkeysService } from 'src/app/services/events/shortcuts/hotkeys.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { SidebarComponent } from './sidebar.component';
import { WorkingAreaComponent } from '../working-area/working-area.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let selector: ToolSelectorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarComponent ],
      providers: [
        ToolSelectorService,
        WorkingAreaComponent,
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

  it('#ngOnInit should init', () => {
    expect(component.currentTool).toEqual(Tools.None);
    component['toolSelectorService'].$currentTool.next(Tools.Brush);
    expect(component.currentTool).toEqual(Tools.Brush);
  });

  it('#selectTool should select tool', () => {
    component.selectTool(Tools.Line);
    expect(component['toolSelectorService'].$currentTool.value).toEqual(Tools.Line);
    component.selectTool(Tools.Brush);
    expect(component['toolSelectorService'].$currentTool.value).toEqual(Tools.Brush);
  });

  it('#selectTool should select current tool', () => {
    component.selectTool(Tools.Line);
    expect(selector.$currentTool.value).toEqual(Tools.Line);
  });

  it('#saveServerProject should open dialog to save on server', () => {
    const spy = spyOn(component['workingAreaComponent'], 'saveServerProject');
    component.saveServerProject();
    expect(spy).toHaveBeenCalled();
  });

  it('#createNewProject should open dialog to create a new projet', () => {
    const spy = spyOn(component['workingAreaComponent'], 'createNewProject');
    component.createNewProject();
    expect(spy).toHaveBeenCalled();
  });

  it('#openGallery should open dialog to for the gallery', () => {
    const spy = spyOn(component['workingAreaComponent'], 'openGallery');
    component.openGallery();
    expect(spy).toHaveBeenCalled();
  });

  it('#exportProject should open dialog to export current projet', () => {
    const spy = spyOn(component['workingAreaComponent'], 'exportProject');
    component.exportProject();
    expect(spy).toHaveBeenCalled();
  });

  it('#openUserGuide should open dialog to open the user guide', () => {
    const spy = spyOn(component['workingAreaComponent'], 'openUserGuide');
    component.openUserGuide();
    expect(spy).toHaveBeenCalled();
  });
});
