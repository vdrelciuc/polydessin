import { Component, OnInit } from '@angular/core';
import * as CONSTANT from 'src/app/classes/constants';
import { Tools } from 'src/app/enums/tools';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawablePropertiesService } from 'src/app/services/index/drawable/properties/drawable-properties.service';
import { RectangleService } from 'src/app/services/index/drawable/rectangle/rectangle.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';

@Component({
  selector: 'app-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss']
})
export class RectangleComponent implements OnInit {

  readonly name: string = Tools.Rectangle;
  readonly SLIDER_MINIMUM = CONSTANT.THICKNESS_MINIMUM;
  readonly SLIDER_MAXIMUM = CONSTANT.THICKNESS_MAXIMUM;

  constructor(
    protected service: RectangleService,
    private toolSelector: ToolSelectorService,
    protected attributes: DrawablePropertiesService,
    protected colorSelectorService: ColorSelectorService
    ) {
    this.service = this.toolSelector.getRectangle();
  }

  ngOnInit(): void {
    this.service.initializeProperties();
  }

  updateBorder(): void {
    this.service.updateTracingType("border");
  }

  updateFill(): void {
    this.service.updateTracingType("fill");
  }
}
