import { Component, OnInit } from '@angular/core';
import { Tools } from 'src/app/enums/tools';
import { BrushService } from 'src/app/services/index/drawable/brush/brush.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { DrawablePropertiesService } from 'src/app/services/index/drawable/properties/drawable-properties.service';
import * as CONSTANT from 'src/app/classes/constants';

@Component({
  selector: 'app-brush',
  templateUrl: './brush.component.html',
  styleUrls: ['./brush.component.scss']
})
export class BrushComponent implements OnInit {

  readonly name: string = Tools.Brush;
  protected thickness: number;

  constructor(
    protected service: BrushService,
    private toolSelector: ToolSelectorService,
    protected attributes: DrawablePropertiesService
    ) {
    this.service = this.toolSelector.getBrush();
    this.service.thickness = this.thickness = CONSTANT.THICKNESS_DEFAULT;
  }

  ngOnInit(): void {
    this.thickness = this.attributes.thickness.value;
    this.service.initializeProperties(this.attributes);
  }

  onThicknessChange(): void {
    if (this.service.thickness < CONSTANT.THICKNESS_MINIMUM) {
      this.attributes.thickness.next(CONSTANT.THICKNESS_MINIMUM);
    } else {
      if (this.service.thickness > CONSTANT.THICKNESS_MAXIMUM) {
        this.attributes.thickness.next(CONSTANT.THICKNESS_MAXIMUM);
      } else {
        this.attributes.thickness.next(this.thickness);
      }
    }
  }

}
