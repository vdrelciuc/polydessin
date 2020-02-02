import { Component, OnInit } from '@angular/core';
import { Tools } from 'src/app/enums/tools';
import { DrawablePropertiesService } from 'src/app/services/index/drawable/properties/drawable-properties.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { PencilService } from 'src/app/services/index/drawable/pencil/pencil.service';
import * as CONSTANT from 'src/app/classes/constants';

@Component({
  selector: 'app-pencil',
  templateUrl: './pencil.component.html',
  styleUrls: ['./pencil.component.scss']
})
export class PencilComponent implements OnInit {

  readonly name: string = Tools.Pencil;
  readonly SLIDER_MINIMUM = CONSTANT.THICKNESS_MINIMUM;
  readonly SLIDER_MAXIMUM = CONSTANT.THICKNESS_MAXIMUM;
  protected thickness: number;

  constructor(
    protected service: PencilService,
    private toolSelector: ToolSelectorService,
    protected attributes: DrawablePropertiesService
    ) {
    this.service = this.toolSelector.getPencil();
  }

  ngOnInit(): void {
    console.log('component pencil init');
    this.thickness = this.attributes.thickness.value;
    this.service.initializeProperties(this.attributes);
  }
}