import { Component } from '@angular/core';
import * as CONSTANT from 'src/app/classes/constants';
import { Tools } from 'src/app/enums/tools';
import { SprayService } from 'src/app/services/index/drawable/spray/spray.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { DrawablePropertiesService } from 'src/app/services/index/drawable/properties/drawable-properties.service';
import { ColorSelectorService } from 'src/app/services/color-selector.service';

@Component({
  selector: 'app-spray',
  templateUrl: './spray.component.html',
  styleUrls: ['./spray.component.scss']
})
export class SprayComponent {

  readonly name: string = Tools.spray;

  readonly SLIDER_MINIMUM = CONSTANT.THICKNESS_MINIMUM;
  readonly SLIDER_MAXIMUM = CONSTANT.THICKNESS_MAXIMUM;

  constructor(
    public service: SprayService,
    private toolSelector: ToolSelectorService,
    protected attributes: DrawablePropertiesService,
    protected colorSelectorService: ColorSelectorService
    ) {
    this.service = this.toolSelector.getSpray();
  }

}
