import { Component, OnInit } from '@angular/core';
import * as CONSTANT from 'src/app/classes/constants';
import { Tools } from 'src/app/enums/tools';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawablePropertiesService } from 'src/app/services/index/drawable/properties/drawable-properties.service';
import { EllipseService } from 'src/app/services/index/drawable/ellipse/ellipse.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';

@Component({
  selector: 'app-ellipse',
  templateUrl: './ellipse.component.html',
  styleUrls: ['./ellipse.component.scss']
})
export class EllipseComponent implements OnInit {

  readonly name: string = Tools.Ellipse;
  readonly SLIDER_MINIMUM = CONSTANT.THICKNESS_MINIMUM;
  readonly SLIDER_MAXIMUM = CONSTANT.THICKNESS_MAXIMUM;

  constructor(
    protected service: EllipseService,
    private toolSelector: ToolSelectorService,
    protected attributes: DrawablePropertiesService,
    protected colorSelectorService: ColorSelectorService
    ) {
    this.service = this.toolSelector.getEllipse();
  }

  ngOnInit(): void {
    this.service.initializeProperties();
  }

  updateBorder(): void {
    this.service.updateTracingType('border');
  }

  updateFill(): void {
    this.service.updateTracingType('fill');
  }

}
