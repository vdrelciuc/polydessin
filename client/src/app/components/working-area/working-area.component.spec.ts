import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatCheckboxModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatOptionModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatTooltipModule,
  MatSnackBarModule
} from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { DrawerService } from 'src/app/services/side-nav-drawer/drawer.service';
import { BrushComponent } from '../brush/brush.component';
import { CanvasComponent } from '../canvas/canvas.component';
import { ColorPaletteComponent } from '../color-palette/color-palette.component';
import { ColorPanelComponent } from '../color-panel/color-panel.component';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { ColorSliderComponent } from '../color-slider/color-slider.component';
import { CreateNewComponent } from '../create-new/create-new.component';
import { LineComponent } from '../line/line.component';
import { OptionPannelComponent } from '../option-pannel/option-pannel.component';
import { PencilComponent } from '../pencil/pencil.component';
import { RectangleComponent } from '../rectangle/rectangle.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { WorkspaceComponent } from '../workspace/workspace.component';
import { WorkingAreaComponent } from './working-area.component';
import { EllipseComponent } from '../ellipse/ellipse.component';
import { GridComponent } from '../grid/grid.component';
import { EraserComponent } from '../eraser/eraser.component';
import { PolygonComponent } from '../polygon/polygon.component';
import { SelectionComponent } from '../selection/selection.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Tools } from 'src/app/enums/tools';
import { GalleryComponent } from '../gallery/gallery.component';
import { Observable } from 'rxjs';

describe('WorkingAreaComponent', () => {
  let component: WorkingAreaComponent;
  let fixture: ComponentFixture<WorkingAreaComponent>;

  const numberOfSubscription = 29;
  // const numberOfPreventedDefault = 4;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CanvasComponent,
        CreateNewComponent,
        ColorPanelComponent,
        ColorPaletteComponent,
        ColorPickerComponent,
        ColorSliderComponent,
        BrushComponent,
        OptionPannelComponent,
        WorkingAreaComponent,
        SidebarComponent,
        LineComponent,
        PencilComponent,
        RectangleComponent,
        EllipseComponent,
        WorkspaceComponent,
        GridComponent,
        EraserComponent,
        PolygonComponent,
        SelectionComponent

      ],
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        MatSidenavModule,
        RouterModule.forRoot(
          [
            { path: '', component: SidebarComponent}
          ]
        ),
        FormsModule,
        MatSliderModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        MatDividerModule,
        MatRadioModule,
        MatExpansionModule,
        MatIconModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        HttpClientModule
      ],
      providers: [
        {provide: APP_BASE_HREF, useValue : '/' }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [CreateNewComponent] } })
    .compileComponents();
    fixture = TestBed.createComponent(WorkingAreaComponent);
    component = fixture.componentInstance;
    history.pushState({
      comingFromEntryPoint: true
    }, 'mockState');
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit shouldn\'t open', () => {
    const spy = spyOn(component['dialog'], 'open');
    history.pushState({
      comingFromEntryPoint: false
    }, 'mockState');
    component.ngOnInit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  it('#ngOnInit shouldn open', () => {
    const spy = spyOn(component['dialog'], 'open');
    history.pushState({
      comingFromEntryPoint: true
    }, 'mockState');
    component.ngOnInit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(CreateNewComponent, { disableClose: true });
    });
  });

  it('#prepareWorkingAreaShortcuts should setup shortcuts', () => {
    component['toolSelectorService'].$currentTool.next(Tools.Brush);
    component['shortcutManager'].saveCurrentTool();
    component.prepareWorkingAreaShortcuts();
    expect(component['shortcutManager']['workingAreaComponent']).toEqual(component);
    expect(component['toolSelectorService'].$currentTool.value).toEqual(Tools.Brush);
    expect(component['shortcutManager']['subscriptions'].length).toEqual(numberOfSubscription);
  });

  it('#getDrawerStatus should drawer be open', () => {
    expect(component.getDrawerStatus()).toEqual(true);
  });

  it('#getDrawerStatus should drawer be closed', () => {
    const drawer = TestBed.get<DrawerService>(DrawerService);
    drawer.navIsOpened = false;
    expect(component.getDrawerStatus()).toEqual(false);
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
    component['toolSelectorService'].$currentTool.next(Tools.Brush);
    component['galleryService'].refToSvg = {
      nativeElement: {
        childElementCount: 2
      } as SVGGElement
    };
    const spy = spyOn(component['snackBar'], 'open');
    const spy2 = spyOn(component['dialog'], 'closeAll');
    component.saveServerProject();
    expect(component['toolSelectorService'].$currentTool.value).toEqual(Tools.None);
    expect(component['shortcutManager']['savedTool']).toEqual(Tools.Brush);
    expect(spy).not.toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('#createNewProject should open new project dialog', () => {
    const spy = spyOn(component['dialog'], 'closeAll');
    const spy2 = spyOn(component['dialog'], 'open');
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
    component['toolSelectorService'].$currentTool.next(Tools.Brush);
    component['galleryService'].refToSvg = {
      nativeElement: {
        childElementCount: 1
      } as SVGGElement
    };
    component.exportProject();
    expect(component['toolSelectorService'].$currentTool.value).toEqual(Tools.None);
    expect(component['shortcutManager']['savedTool']).toEqual(Tools.Brush);
    expect(spy).toHaveBeenCalled();
  });

  it('#openUserGuide should open user guide', () => {
    const spy = spyOn(component['dialog'], 'open');
    const spy2 = spyOn(component['dialog'], 'closeAll');
    component['toolSelectorService'].$currentTool.next(Tools.Brush);
    component.openUserGuide();
    expect(component['toolSelectorService'].$currentTool.value).toEqual(Tools.None);
    expect(component['shortcutManager']['savedTool']).toEqual(Tools.Brush);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
});
