import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPickerComponent } from './color-picker.component';
import { ColorPaletteComponent } from '../color-palette/color-palette.component';
import { FormsModule } from '@angular/forms';
import { Color } from 'src/app/classes/color';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { ColorType } from 'src/app/enums/color-types';
import { BehaviorSubject } from 'rxjs';

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;
  let service: ColorSelectorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPickerComponent ],
      providers: [
        FormsModule,
        ColorSelectorService,
        {
          provide: MatDialogRef,
          useValue: {
            moduleDef: ColorPickerComponent,
            close: () => null,
          }
        },
        {
          provide: ColorPaletteComponent,
          useValue: {
            initialColor: new Color('#000000'),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.get<ColorSelectorService>(ColorSelectorService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#updateRed should set new red value', () => {
    let inputElement: HTMLTextAreaElement = document.createElement('textarea', );
    inputElement.value = 'FF';
    let event: Event = new Event('input', {});
    inputElement.dispatchEvent(event);
    component.updateRed(event);
    expect(component.selectedColor.getRedHex()).toEqual('FF');
  });

  it('#updateGreen should set new green value', () => {

  });

  it('#updateGreen shouldn\'t set new green value', () => {

  });

  it('#updateBlue should set new blue value', () => {

  });

  it('#updateBlue shouldn\'t set new blue value', () => {

  });

  it('#onDialogClose should close dialog', () => {
    const spy = spyOn(component['dialogRef'], 'close');
    component.onDialogClose();
    expect(spy).toHaveBeenCalled();
  });

  it('#onConfirm should update color', () => {
    service['colorToChange'] = ColorType.Primary;
    service['primaryColor'] = new BehaviorSubject<Color>(new Color('#FFFFFF'));
    component.selectedColor = new Color('#ABCDEF')
    component.onConfirm();
    expect(service['primaryColor'].value.getHex()).toEqual('#ABCDEF');
  });
  
});
