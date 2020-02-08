import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPickerComponent } from './color-picker.component';
import { ColorPaletteComponent } from '../color-palette/color-palette.component';
import { FormsModule } from '@angular/forms';
import { Color } from 'src/app/classes/color';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material';

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
    let inputElement: HTMLTextAreaElement = new HTMLTextAreaElement();
    inputElement.value = 'FF';
    let event: Event = new Event('input', {});
    inputElement.dispatchEvent(event);
    component.updateRed(event);
    expect(component.selectedColor.getRedHex()).toEqual('FF');
  });
  
});
