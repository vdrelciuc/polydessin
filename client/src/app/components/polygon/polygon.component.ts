import { Component, OnInit } from '@angular/core';
import * as CONSTANT from 'src/app/classes/constants';
import { Tools } from 'src/app/enums/tools';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { PolygonService } from 'src/app/services/index/drawable/polygon/polygon.service';
import { DrawablePropertiesService } from 'src/app/services/index/drawable/properties/drawable-properties.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';

@Component({
  selector: 'app-polygon',
  templateUrl: './polygon.component.html',
  styleUrls: ['./polygon.component.scss']
})
export class PolygonComponent implements OnInit {

  readonly name: string = Tools.Polygon;
  readonly SLIDER_MINIMUM = CONSTANT.THICKNESS_MINIMUM;
  readonly SLIDER_MAXIMUM = CONSTANT.THICKNESS_MAXIMUM;

  constructor(
    protected service: PolygonService,
    private toolSelector: ToolSelectorService,
    protected attributes: DrawablePropertiesService,
    protected colorSelectorService: ColorSelectorService
    ) {
    this.service = this.toolSelector.getPolygon();
  }

  ngOnInit(): void {
    this.service.initializeProperties();
  }

  updateBorder(): void {
    this.service.shapeStyle.hasBorder = !this.service.shapeStyle.hasBorder;
  }

  updateFill(): void {
    this.service.shapeStyle.hasFill = !this.service.shapeStyle.hasFill;
  }
}
