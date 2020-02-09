import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { APP_BASE_HREF } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { Color } from 'src/app/classes/color';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { ColorType } from 'src/app/enums/color-types';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { CreateNewComponent } from './create-new.component';
describe('CreateNewComponent', () => {
  let component: CreateNewComponent;
  let fixture: ComponentFixture<CreateNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewComponent ],
      providers: [
        ColorPickerComponent,
        {
          provide: MatDialogRef,
          useValue: {
            moduleDef: CreateNewComponent,
            close: () => null,
          }
        },
        {
          provide: MatDialog,
          useValue: {
            open: () => null,
            closeAll: () => null,
          }
        },
        {provide: APP_BASE_HREF, useValue : '/' }
      ],
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        RouterModule.forRoot(
          [{
            path : '' , component : CreateNewComponent
          }]
        ),
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(CreateNewComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#getcanvasSizeX should return drawable width', () => {
    component['widthChanged'] = true;
    component['canvasSize'] = new CoordinatesXY(10, 10);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.getcanvasSizeX()).toEqual(10);
    });
  });

  it('#getcanvasSizeY should return drawable height', () => {
    component['widthChanged'] = true;
    component['canvasSize'] = new CoordinatesXY(10, 10);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.getcanvasSizeX()).toEqual(10);
    });
  });

  it('#getcanvasSizeX should return drawable width', () => {
    component['widthChanged'] = false;
    component['workspaceSize'] = new CoordinatesXY(100, 100);
    component['canvasSize'] = new CoordinatesXY(10, 10);
    expect(component.getcanvasSizeX()).toEqual(100);
  });

  it('#getcanvasSizeY should return drawable height', () => {
    component['widthChanged'] = false;
    component['workspaceSize'] = new CoordinatesXY(100, 100);
    component['canvasSize'] = new CoordinatesXY(10, 10);
    expect(component.getcanvasSizeX()).toEqual(100);
  });

  it('#onColorSelect should be able to select color', () => {
    component['previewColor'] = new Color('#FFFFFF');
    const spy2 = spyOn(component['dialog'], 'open');
    const spy = spyOn(component['colorSelectorService'], 'updateColor');
    component.onColorSelect();
    expect(spy).toHaveBeenCalledWith(new Color('#FFFFFF'));
    expect(spy2).toHaveBeenCalledWith(ColorPickerComponent, { disableClose: true });
    expect(component['colorSelectorService'].colorToChange).toEqual(ColorType.Preview);
  });

  it('#onConfirm should update color', () => {
    const spy = spyOn(component['dialogRef'], 'close');
    history.pushState({
      comingFromEntryPoint: false
    }, 'mockState');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.onConfirm();
      expect(spy).toHaveBeenCalled();
      expect(history.state['comingFromEntryPoint']).not.toBeTruthy();
      expect(component['colorSelectorService'].colorToChange).toEqual(ColorType.Background);
    });
  });

  it('#onCloseDialog should close', () => {
    const spy = spyOn(component['dialogRef'], 'close');
    history.pushState({
      comingFromEntryPoint: false
    }, 'mockState');
    component.onCloseDialog();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      expect(history.state['comingFromEntryPoint']).not.toBeTruthy();
    });
  });

  it('#onCloseDialog should close', () => {
    history.pushState({
      comingFromEntryPoint: true
    }, 'mockState');
    const spy = spyOn(component['dialogRef'], 'close');
    const spy2 = spyOn(component['router'], 'navigateByUrl');
    component.onCloseDialog();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalledWith('/');
      expect(history.state['comingFromEntryPoint']).toBeTruthy();
    });
   });

  it('#openDialogWarning should open warning dialog', () => {
    const spy = spyOn(component['dialog'], 'open');
    component.openDialogWarning();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });
});
