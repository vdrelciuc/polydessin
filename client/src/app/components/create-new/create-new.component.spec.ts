import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewComponent } from './create-new.component';
import { MatDialogRef, MatDialog, MatDialogModule } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { ColorType } from 'src/app/enums/color-types';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { Color } from 'src/app/classes/color';
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
          }
        }
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
    component['canvasSize'] = new CoordinatesXY(10,10);
    expect(component.getcanvasSizeX()).toEqual(10);
  });

  it('#getcanvasSizeY should return drawable height', () => {
    component['canvasSize'] = new CoordinatesXY(10,10);
    expect(component.getcanvasSizeX()).toEqual(10);
  });

  it('#onColorSelect should be able to select color', () => {
    component['previewColor'] = new Color('#FFFFFF');
    const spy2 = spyOn(component['colorDialog'], 'open');
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
    component.onConfirm();
    expect(spy).toHaveBeenCalled();
    expect(history.state['comingFromEntryPoint']).not.toBeTruthy();
    expect(component['colorSelectorService'].colorToChange).toEqual(ColorType.Background);
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
});
