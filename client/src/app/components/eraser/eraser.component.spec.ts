import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EraserComponent } from './eraser.component';
import { MatSliderModule, MatFormFieldModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

describe('EraserComponent', () => {
  let component: EraserComponent;
  let fixture: ComponentFixture<EraserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EraserComponent ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatSliderModule,
        MatFormFieldModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EraserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
