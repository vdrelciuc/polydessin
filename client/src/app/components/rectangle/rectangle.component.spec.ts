import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RectangleComponent } from './rectangle.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Color } from 'src/app/classes/color';
import { ColorSelectorService } from 'src/app/services/color-selector.service';

describe('RectangleComponent', () => {
  let component: RectangleComponent;
  let fixture: ComponentFixture<RectangleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RectangleComponent ],
      providers: [
        {
          provide: ColorSelectorService,
          useValue: {
            primaryColor: new BehaviorSubject<Color>(new Color('#000000')),
            secondaryColor: new BehaviorSubject<Color>(new Color('#000000')),
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectangleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
