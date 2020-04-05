import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatherComponent } from './feather.component';
import { MatSliderModule } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FeatherComponent', () => {
  let component: FeatherComponent;
  let fixture: ComponentFixture<FeatherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatherComponent ],
      imports: [
        MatSliderModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(FeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#changeThickness should update thickness', () => {
    const testValue = 50;
    component.changeThickness(testValue);
    expect(component['service'].thickness.value).toEqual(testValue);
  });

  it('#changeHeight should update height', () => {
    const testValue = 50;
    component.changeHeight(testValue);
    expect(component['service'].height.value).toEqual(testValue);
  });

  it('#changeAngle should update angle', () => {
    const testValue = 50;
    component.changeAngle(testValue);
    expect(component['service'].angle.value).toEqual(testValue);
  });
});
