import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatherComponent } from './feather.component';
import { MatSliderModule } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FeatherService } from 'src/app/services/drawable/feather/feather.service';

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
