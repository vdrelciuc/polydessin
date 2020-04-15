// tslint:disable: no-string-literal | Reason: used to access private variables
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSliderModule } from '@angular/material';
import { FeatherService } from 'src/app/services/drawable/feather/feather.service';
import { FeatherComponent } from './feather.component';

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
    expect(component['service']).toEqual(new FeatherService());
  });
});
