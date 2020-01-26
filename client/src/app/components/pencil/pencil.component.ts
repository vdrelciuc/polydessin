import { Component, OnInit } from '@angular/core';
import { Tools } from 'src/app/enums/tools';
import { DrawablePropertiesService } from 'src/app/services/index/drawable/properties/drawable-properties.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { PenService } from 'src/app/services/index/drawable/pencil/pencil.service';
import * as CONSTANT from 'src/app/classes/constants';

@Component({
  selector: 'app-pen',
  templateUrl: './pencil.component.html',
  styleUrls: ['./pencil.component.scss']
})
export class PenComponent implements OnInit {

  readonly name: string = Tools.Pencil;
  protected thickness: number;

  constructor(
    protected service: PenService,
    private toolSelector: ToolSelectorService,
    protected attributes: DrawablePropertiesService
    ) {
    this.service = this.toolSelector.getPencil();
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
