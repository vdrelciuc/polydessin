// tslint:disable: no-string-literal | Reason: used to access private variables
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSliderModule } from '@angular/material';
import { SprayComponent } from './spray.component';

describe('SprayComponent', () => {
  let component: SprayComponent;
  let fixture: ComponentFixture<SprayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprayComponent ],
      imports: [
        MatSliderModule,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(SprayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
