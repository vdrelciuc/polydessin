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

  constructor(
    public service: PencilService,
    private toolSelector: ToolSelectorService,
    private attributes: DrawablePropertiesService
    ) {
      this.service = this.toolSelector.getPencil();
  }

  ngOnInit(): void {
    // this.thickness = this.attributes.thickness.value;
    this.service.initializeProperties(this.attributes);
  }

  onThicknessChange(): void {
    if (this.service.thickness < CONSTANT.THICKNESS_MINIMUM) {
      this.attributes.thickness.next(CONSTANT.THICKNESS_MINIMUM);
    } else {
      if (this.service.thickness > CONSTANT.THICKNESS_MAXIMUM) {
        this.attributes.thickness.next(CONSTANT.THICKNESS_MAXIMUM);
      } else {
        this.attributes.thickness.next(this.service.thickness);
      }
    }
  }

}
