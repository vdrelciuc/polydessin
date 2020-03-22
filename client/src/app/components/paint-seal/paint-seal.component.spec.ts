import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintSealComponent } from './paint-seal.component';

describe('PaintSealComponent', () => {
  let component: PaintSealComponent;
  let fixture: ComponentFixture<PaintSealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaintSealComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintSealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
