// tslint:disable: no-magic-numbers | Reason : testing arbitrary values
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderModule, MatSlideToggleModule } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { Color } from 'src/app/classes/color';
import { ColorSelectorService } from 'src/app/services/color-selector/color-selector.service';
import { PolygonService } from 'src/app/services/drawable/polygon/polygon.service';
import { ToolSelectorService } from 'src/app/services/tools-selector/tool-selector.service';
import { PolygonComponent } from './polygon.component';

describe('PolygonComponent', () => {
  let component: PolygonComponent;
  let fixture: ComponentFixture<PolygonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolygonComponent ],
      providers: [
        PolygonService,
        ToolSelectorService,
        {
          provide: ColorSelectorService,
          useValue: {
            primaryColor: new BehaviorSubject<Color>(new Color('#FFFFFF')),
            secondaryColor: new BehaviorSubject<Color>(new Color('#000000')),
            recentColors: new BehaviorSubject<Color[]>([new Color('#FFFFFF'), new Color('#000000')]),
            primaryTransparency: new BehaviorSubject<number>(0.5),
            secondaryTransparency: new BehaviorSubject<number>(0.8),
          },
        },
      ],
      imports: [MatSliderModule, MatSlideToggleModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(PolygonComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    component['service']['colorSelectorService'] = component['colorSelectorService'];
    component.ngOnInit();
    expect(component['service']['colorSelectorService'].primaryColor.value).toEqual(new Color('#FFFFFF'));
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
