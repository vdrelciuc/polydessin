import { Component, OnInit } from '@angular/core';
import { Tools } from 'src/app/enums/tools';
import * as CONSTANT from 'src/app/classes/constants';
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
    ) {
    this.service = this.toolSelector.getRectangle();
  }

  ngOnInit(): void {
    this.service.initializeProperties(this.attributes);
  }

  updateBorder(): void {
    this.service.shapeStyle.hasBorder = !this.service.shapeStyle.hasBorder;
  }

  updateFill(): void {
    this.service.shapeStyle.hasFill = !this.service.shapeStyle.hasFill;
  }
}
