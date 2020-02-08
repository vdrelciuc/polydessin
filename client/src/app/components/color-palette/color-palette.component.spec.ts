import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPaletteComponent } from './color-palette.component';
import { Color } from 'src/app/classes/color';

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
    component.initialColor = new Color('#000000');
    component.ngAfterViewInit();
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('#ngOnChanges should apply changes', () => {
  //   component.ngOnChanges(new SimpleChange)
  //   );
  // });

  it('#emitColor should emit newly slected color', () => {
    const spy = spyOn(component.newColor, 'emit');
    component.emitColor(1,1);
    expect(spy).toHaveBeenCalledWith(new Color('#FCFCFC'));
  });

  it('#onMouseUp should change mouse state', () => {
    component['isMouseDown'] = true;
    window.dispatchEvent(new MouseEvent('mouseup', {button: 0}));
    expect(component['isMouseDown']).not.toBeTruthy();
  });

  it('#onMouseMove should change color', () => {
    component['isMouseDown'] = true;
    const spy = spyOn(component, 'emitColor');
    component.onMouseMove(new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100 
    }));
    expect(component['currentSelectedPosition'].x).toEqual(100);
    expect(component['currentSelectedPosition'].y).toEqual(100);
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseMove shouldn\'t change anything', () => {
    component['currentSelectedPosition'] = {x: 1, y: 1} ;
    component['isMouseDown'] = false;
    const spy = spyOn(component, 'emitColor');
    component.onMouseMove(new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100 
    }));
    expect(component['currentSelectedPosition'].x).toEqual(1);
    expect(component['currentSelectedPosition'].y).toEqual(1);
    expect(spy).not.toHaveBeenCalled();
  });

  it('#onMouseDown should ', () => {
    component.onMouseDown(new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100 
    }));
    expect(component['currentSelectedPosition'].x).toEqual(100);
    expect(component['currentSelectedPosition'].y).toEqual(100);
    expect(component['isMouseDown']).toBeTruthy();
  });
});
