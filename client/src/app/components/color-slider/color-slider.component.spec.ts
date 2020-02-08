import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorSliderComponent } from './color-slider.component';

describe('ColorSliderComponent', () => {
  let component: ColorSliderComponent;
  let fixture: ComponentFixture<ColorSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorSliderComponent ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ColorSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onMouseMove should modify on mouse down', () => {
    const event = new MouseEvent('mousedown', {});
    component.onMouseDown(event);
    const spy = spyOn(component, 'emitHue');
    component.onMouseMove(event);
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseMove shouldn\'t modify on mouse up', () => {
    const spy = spyOn(component, 'emitHue');
    component.onMouseMove(new MouseEvent('mouseup', {}));
    expect(spy).not.toHaveBeenCalled();
  });

  it('#onMouseDown should emit a new hue', () => {
    const spy = spyOn(component.newHue, 'emit');
    component.onMouseDown(new MouseEvent('mousedown', {}));
    expect(spy).toHaveBeenCalled();
  });
});
