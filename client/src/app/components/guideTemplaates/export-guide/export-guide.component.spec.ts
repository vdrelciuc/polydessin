import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportGuideComponent } from './export-guide.component';

describe('ExportGuideComponent', () => {
  let component: ExportGuideComponent;
  let fixture: ComponentFixture<ExportGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
