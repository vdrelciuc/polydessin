import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Color } from 'src/app/classes/color';
import { ColorPaletteComponent } from './color-palette.component';

describe('ColorPaletteComponent', () => {
  let component: ColorPaletteComponent;
  let fixture: ComponentFixture<ColorPaletteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPaletteComponent ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ColorPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.initialColor = new Color('#000000');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
