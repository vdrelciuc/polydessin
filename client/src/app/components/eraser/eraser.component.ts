import { Component, OnInit } from '@angular/core';
import * as CONSTANT from 'src/app/classes/constants';
import { EraserService } from 'src/app/services/index/drawable/eraser/eraser.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { DrawablePropertiesService } from 'src/app/services/index/drawable/properties/drawable-properties.service';
import { ColorSelectorService } from 'src/app/services/color-selector.service';

@Component({
  selector: 'app-eraser',
  templateUrl: './eraser.component.html',
  styleUrls: ['./eraser.component.scss']
})
export class EraserComponent implements OnInit {

  readonly THICKNESS_ERASER_MINIMUM = CONSTANT.THICKNESS_MINIMUM_ERASER;
  readonly THICKNESS_ERASER_MAXIMUM = CONSTANT.THICKNESS_MAXIMUM;

  constructor(
    public service: EraserService,
    private toolSelector: ToolSelectorService,
    protected attributes: DrawablePropertiesService,
    protected colorSelectorService: ColorSelectorService
  ) {
    this.service = this.toolSelector.getEraser();
  }

  ngOnInit() {
  }

}
