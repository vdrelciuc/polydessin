// tslint:disable: no-string-literal | Reason: used to access private variables
// tslint:disable: no-magic-numbers | Reason: arbitrary values used for testing purposes
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange, MatSliderModule } from '@angular/material';
import { PaintSealService } from 'src/app/services/drawable/paint-seal/paint-seal.service';
import { PaintSealComponent } from './paint-seal.component';

describe('PaintSealComponent', () => {
  let component: PaintSealComponent;
  let fixture: ComponentFixture<PaintSealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaintSealComponent ],
      providers: [

      ],
      imports: [
        MatSliderModule
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(PaintSealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component['service']).toEqual(new PaintSealService());
  });

  it('#setTolerance should change tolerance', () => {
    expect(component['service'].tolerance.value).toEqual(15);
    component.setTolerance({value: 50} as unknown as MatSliderChange);
    expect(component['service'].tolerance.value).toEqual(50);
  });

  it('#setTolerance should not change tolerance value is null', () => {
    expect(component['service'].tolerance.value).toEqual(15);
    component.setTolerance({value: null} as unknown as MatSliderChange);
    expect(component['service'].tolerance.value).toEqual(15);
  });
});
