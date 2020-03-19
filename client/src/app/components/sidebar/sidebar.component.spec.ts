import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { APP_BASE_HREF } from '@angular/common';
import { MatDialog, MatTooltipModule, MatSnackBarModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { Tools } from 'src/app/enums/tools';
import { HotkeysService } from 'src/app/services/events/shortcuts/hotkeys.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { SidebarComponent } from './sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { GalleryComponent } from '../gallery/gallery.component';
import { CreateNewComponent } from '../create-new/create-new.component';
import { Observable } from 'rxjs';

fdescribe('SidebarComponent', () => {
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
    expect(component['subscriptions'].length).toEqual(21);
  });

  it('#ngOnInit should init', () => {
    expect(component.currentTool).toEqual(Tools.Selection);
    component['toolSelectorService'].$currentTool.next(Tools.Brush);
    expect(component.currentTool).toEqual(Tools.Brush);
  });

  it('#selectTool should select tool', () => {
    component.selectTool(Tools.Line);
    expect(component['toolSelectorService'].$currentTool.value).toEqual(Tools.Line);
    component.selectTool(Tools.Brush);
    expect(component['toolSelectorService'].$currentTool.value).toEqual(Tools.Brush);
  });

  it('#saveServerProject should not save empty canvas', () => {
    component['galleryService'].refToSvg = {
      nativeElement: {
        childElementCount: 0
      } as SVGGElement
    };
    const spy = spyOn(component['snackBar'], 'open');
    component.saveServerProject();
    expect(spy).toHaveBeenCalledWith('Vous ne pouvez pas sauvegarder un canvas vide', '', {
      duration: 2000,
    });
  });

  it('#saveServerProject should save valid canvas', () => {
    component['galleryService'].refToSvg = {
      nativeElement: {
        childElementCount: 1
      } as SVGGElement
    };
    const spy = spyOn(component['snackBar'], 'open');
    const spy2 = spyOn(component['dialog'], 'closeAll');
    component.saveServerProject();
    expect(spy).not.toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('#setupShortcuts should setup shortcuts', () => {
    const spy = spyOn(selector, 'setCurrentTool');
    const spy2 = spyOn(component, 'createNewProject');
    const keys = ['l', 'c', '1', 'w', 'control.o'];
    for (const element of keys) {
      document.dispatchEvent(new KeyboardEvent('keydown', {
        key: element,
        bubbles: true
      }));
    }
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy2).toHaveBeenCalled();
  });

  it('#selectTool should select current tool', () => {
    component.selectTool(Tools.Line);
    expect(selector.$currentTool.value).toEqual(Tools.Line);
    expect(component['subscriptions'].length).toEqual(21);
  });

  it('#createNewProject should open new project dialog', () => {
    const spy = spyOn(component['dialog'], 'closeAll');
    const spy2 = spyOn(component['dialog'], 'open').and.callFake( ());
    const spy3 = spyOn(component['createNewDialog'], 'afterClosed').and.callFake(() => new Observable());
    component.openGallery();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith(CreateNewComponent, { disableClose: true });
    expect(spy3).toHaveBeenCalled();
  });

  it('#openGallery should open gallery', () => {
    const spy = spyOn(component['dialog'], 'closeAll');
    const spy2 = spyOn(component['dialog'], 'open');
    const spy3 = spyOn(component['galleryDialog'], 'afterClosed').and.callFake(() => new Observable());
    component.openGallery();
    expect(component['subscriptions'].length).toEqual(3);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith(GalleryComponent, { disableClose: true });
    expect(spy3).toHaveBeenCalled();
  });

  it('#exportProject should not export empty svg', () => {
    const spy = spyOn(component['snackBar'], 'open');
    component['galleryService'].refToSvg = {
      nativeElement: {
        childElementCount: 0
      } as SVGGElement
    };
    component.exportProject();
    expect(spy).toHaveBeenCalledWith('Vous ne pouvez pas exporter un canvas vide', '', {
      duration: 2000,
    });
  });

  it('#exportProject should export valid svg', () => {
    const spy = spyOn(component['dialog'], 'closeAll');
    component['galleryService'].refToSvg = {
      nativeElement: {
        childElementCount: 1
      } as SVGGElement
    };
    component.exportProject();
    expect(spy).toHaveBeenCalled();
  });

  it('#openDialog should open dialog', () => {
    const spy = spyOn(component['dialog'], 'open');
    component.openDialog();
    expect(spy).toHaveBeenCalled();
  });
});
