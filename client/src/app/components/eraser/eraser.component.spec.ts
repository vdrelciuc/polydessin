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
    fixture = TestBed.createComponent(EraserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#changeThickness should update thickness', () => {
    expect(component['service'].thickness.value).toEqual(3);
    component.changeThickness(10);
    expect(component['service'].thickness.value).toEqual(10);
  });
});
