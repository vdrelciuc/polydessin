import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatOptionModule, MatRadioModule, MatSelectModule, MatSliderModule } from '@angular/material';
import * as CONSTANT from 'src/app/classes/constants';
import { BrushComponent } from './brush.component';
// import { FilterList } from 'src/app/classes/patterns';
// import { BrushService } from 'src/app/services/index/drawable/brush/brush.service';

describe('BrushComponent', () => {
  let component: BrushComponent;
  let fixture: ComponentFixture<BrushComponent>;
  // let service: BrushService;
  const mockedThickness = 15;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrushComponent ],
      imports: [
        FormsModule,
        MatSliderModule,
        MatSelectModule,
        MatOptionModule,
        MatRadioModule
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(BrushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // service = TestBed.get<BrushService>(BrushService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onThicknessChange should change thickness', () => {
    component.onThicknessChange(mockedThickness);
    expect(component.service.thickness).toEqual(mockedThickness);
  });

  it('#onThicknessChange shouldn\'t change thickness, more than maximum', () => {
    component.onThicknessChange(mockedThickness);
    component.onThicknessChange(CONSTANT.THICKNESS_MAXIMUM + 1);
    expect(component.service.thickness).toEqual(CONSTANT.THICKNESS_MAXIMUM);
  });

  it('#onThicknessChange shouldn\'t change thickness, less than minimum', () => {
    component.onThicknessChange(mockedThickness);
    component.onThicknessChange(CONSTANT.THICKNESS_MINIMUM - 1);
    expect(component.service.thickness).toEqual(CONSTANT.THICKNESS_MINIMUM);
  });

  it('#toggleFilters should change filter\'s state', () => {
    component.toggleFilters(); // False by default
    expect(component.showFilters).toBeTruthy();
  });

  // it('#changeFilter should change filter', () => {
  //   component.changeFilter(new FilterList());
  //   expect(service.selectedFilter).toEqual('displacementFilter');
  //   expect(component.selectedOption).toEqual(FilterList[2]);
  // });
});
