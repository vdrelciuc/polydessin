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
import { Observable } from 'rxjs';
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

  it('should return drawable width', () => {
    component['changed'] = true;
    // component['workspaceSize'] = new CoordinatesXY(10, 10);
    // expect(component['workspaceSize'].getX()).toEqual(10);
  });

  it('#setCanvasSizeX should set canvas X', () => {
    component['changed'] = true;
    component.setcanvasSizeX({
      target: {
        value: 10
      }
    });
    component['workspaceService'].size.next(new CoordinatesXY(100, 100));
    // expect(component['workspaceSize'].getX()).toEqual(10);
  });

  it('#setCanvasSizeY should set canvas Y', () => {
    component['changed'] = true;
    component.setcanvasSizeY({
      target: {
        value: 10
      }
    });
    component['workspaceService'].size.next(new CoordinatesXY(100, 100));
    // expect(component['workspaceSize'].getY()).toEqual(10);
  });

  it('#onColorSelect should be able to select color', () => {
    component['previewColor'] = new Color('#FFFFFF');
    const spy2 = spyOn(component['dialog'], 'open')
    .and
    .returnValue({
      afterClosed: () => new Observable
    } as unknown as MatDialogRef<{}, {}>);
    const spy = spyOn(component['colorSelectorService'], 'updateColor');
    component.onColorSelect();
    expect(spy).toHaveBeenCalledWith(new Color('#FFFFFF'));
    expect(spy2).toHaveBeenCalledWith(ColorPickerComponent, { disableClose: true });
    expect(component['colorSelectorService'].colorToChange).toEqual(ColorType.Preview);
  });

  it('#onConfirm should update color', () => {
    history.pushState({
      comingFromEntryPoint: false
    }, 'mockState');
    component.onConfirm();
    expect(history.state['comingFromEntryPoint']).not.toBeTruthy();
    expect(component['colorSelectorService'].colorToChange).toEqual(ColorType.Background);
  });

  it('#onConfirm should open warning message', () => {
    component['canvasService']['layerCount'] = 1;
    const spy = (component.openDialogWarning = jasmine.createSpy().and.callFake(() => null));
    component.onConfirm();
    expect(spy).toHaveBeenCalled();
  });

  it('#onCloseDialog should close', () => {
    const spy = spyOn(component['dialogRef'], 'close');
    history.pushState({
      comingFromEntryPoint: false
    }, 'mockState');
    component.onCloseDialog();
    expect(spy).toHaveBeenCalled();
    expect(history.state['comingFromEntryPoint']).not.toBeTruthy();
  });

  it('#onCloseDialog should close', () => {
    history.pushState({
      comingFromEntryPoint: true
    }, 'mockState');
    const spy = spyOn(component['dialogRef'], 'close');
    const spy2 = spyOn(component['router'], 'navigateByUrl');
    component.onCloseDialog();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith('/');
    expect(history.state['comingFromEntryPoint']).toBeTruthy();
   });

  it('#openDialogWarning should open warning dialog', () => {
    const spy = spyOn(component['dialog'], 'open');
    component.openDialogWarning();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });
});
