import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Color } from 'src/app/classes/color';
import { ColorPaletteComponent } from '../color-palette/color-palette.component';
import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPickerComponent ],
      providers: [
        FormsModule,
        MatDialogRef,
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
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#updateRed should set new red value', () => {
    const inputElement: HTMLTextAreaElement = new HTMLTextAreaElement();
    inputElement.value = 'FF';
    const event: Event = new Event('input', {});
    inputElement.dispatchEvent(event);
    component.updateRed(event);
    expect(component.selectedColor.getRedHex()).toEqual('FF');
  });

});
