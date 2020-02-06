import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPickerComponent } from './color-picker.component';
import { ColorPaletteComponent } from '../color-palette/color-palette.component';
import { FormsModule } from '@angular/forms';
import { Color } from 'src/app/classes/color';

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPickerComponent ],
      providers: [
        FormsModule,
        {
          provide: ColorPaletteComponent,
          useValue: {
            initialColor: new Color('#000000'),
          },
        },
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#updateRed', () => {
    expect(component).toBeTruthy();
  });
  
});
