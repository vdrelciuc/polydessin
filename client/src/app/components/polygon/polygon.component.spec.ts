import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSliderModule, MatSlideToggleModule } from '@angular/material';
import { PolygonComponent } from './polygon.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PolygonService } from 'src/app/services/index/drawable/polygon/polygon.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';

describe('PolygonComponent', () => {
  let component: PolygonComponent;
  let fixture: ComponentFixture<PolygonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolygonComponent ],
      providers: [
        PolygonService,
        ToolSelectorService,
      ],
      imports: [MatSliderModule, MatSlideToggleModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(PolygonComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should invert hasBorder', () => {
    const hasBorder = component['service'].shapeStyle.hasBorder;
    component.updateBorder();
    expect(component['service'].shapeStyle.hasBorder).not.toBe(hasBorder);
  });

  it('should invert hasFill', () => {
    const hasFill = component['service'].shapeStyle.hasFill;
    component.updateFill();
    expect(component['service'].shapeStyle.hasFill).not.toBe(hasFill);
  });
});
