import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatCheckboxModule,
  MatDialogModule,
  MatDialogRef,
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
  MatSnackBarModule,
  MatTooltipModule
} from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Tools } from 'src/app/enums/tools';
import { DrawerService } from 'src/app/services/side-nav-drawer/drawer.service';
import { BrushComponent } from '../brush/brush.component';
import { CanvasComponent } from '../canvas/canvas.component';
import { ColorPaletteComponent } from '../color-palette/color-palette.component';
import { ColorPanelComponent } from '../color-panel/color-panel.component';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { ColorSliderComponent } from '../color-slider/color-slider.component';
import { CreateNewComponent } from '../create-new/create-new.component';
import { EllipseComponent } from '../ellipse/ellipse.component';
import { EraserComponent } from '../eraser/eraser.component';
import { FeatherComponent } from '../feather/feather.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { GridComponent } from '../grid/grid.component';
import { LineComponent } from '../line/line.component';
import { OptionPannelComponent } from '../option-pannel/option-pannel.component';
import { PaintSealComponent } from '../paint-seal/paint-seal.component';
import { PencilComponent } from '../pencil/pencil.component';
import { PolygonComponent } from '../polygon/polygon.component';
import { RectangleComponent } from '../rectangle/rectangle.component';
import { SelectionComponent } from '../selection/selection.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TextComponent } from '../text/text.component';
import { WorkspaceComponent } from '../workspace/workspace.component';
import { WorkingAreaComponent } from './working-area.component';

describe('WorkingAreaComponent', () => {
  let component: WorkingAreaComponent;
  let fixture: ComponentFixture<WorkingAreaComponent>;

  const numberOfSubscription = 32;

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
        SelectionComponent,
        TextComponent,
        FeatherComponent,
        PaintSealComponent
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
    expect(spy).not.toHaveBeenCalled();
  });

  it('#ngOnInit shouldn open', () => {
    const spy = spyOn(component['dialog'], 'open')
    .and
    .returnValue({
      afterClosed: () => new Observable()
    } as unknown as MatDialogRef<{}, {}>);
    history.pushState({
      comingFromEntryPoint: true
    }, 'mockState');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith(CreateNewComponent, { disableClose: true });
  });

  it('#prepareWorkingAreaShortcuts should setup shortcuts', () => {
    component['shortcutManager'].saveCurrentTool();
    component.prepareWorkingAreaShortcuts();
    expect(component['shortcutManager']['workingAreaComponent']).toEqual(component);
    expect(component['shortcutManager']['savedTool']).toEqual(Tools.None);
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
    component['galleryService'].refToSvg = {
      nativeElement: {
        childElementCount: 2
      } as SVGGElement
    };
    const spy = spyOn(component['snackBar'], 'open');
    const spy2 = spyOn(component['dialog'], 'closeAll');
    component.saveServerProject();
    expect(component['shortcutManager']['savedTool']).toEqual(Tools.None);
    expect(spy).not.toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('#createNewProject should open new project dialog', () => {
    const spy = spyOn(component['dialog'], 'closeAll');
    const spy2 = spyOn(component['dialog'], 'open')
    .and
    .returnValue({
      afterClosed: () => new Observable()
    } as unknown as MatDialogRef<{}, {}>);
    component.createNewProject();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith(CreateNewComponent, { disableClose: true });
  });

  it('#openGallery should open gallery', () => {
    const spy = spyOn(component['dialog'], 'closeAll');
    const spy2 = spyOn(component['dialog'], 'open')
    .and
    .returnValue({
      afterClosed: () => new Observable()
    } as unknown as MatDialogRef<{}, {}>);
    component.openGallery();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith(GalleryComponent, { disableClose: true });
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
        childElementCount: 2
      } as SVGGElement
    };
    component.exportProject();
    expect(component['shortcutManager']['savedTool']).toEqual(Tools.None);
    expect(spy).toHaveBeenCalled();
  });

  it('#openUserGuide should open user guide', () => {
    const spy = spyOn(component['dialog'], 'open')
    .and
    .returnValue({
      afterClosed: () => new Observable()
    } as unknown as MatDialogRef<{}, {}>);
    const spy2 = spyOn(component['dialog'], 'closeAll');
    component.openUserGuide();
    expect(component['shortcutManager']['savedTool']).toEqual(Tools.None);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
});
