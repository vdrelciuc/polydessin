import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as CONSTANT from 'src/app/classes/constants';
import { Tools } from 'src/app/enums/tools';
import { HotkeysService } from 'src/app/services/events/shortcuts/hotkeys.service';
import { LineService } from 'src/app/services/index/drawable/line/line.service';
import { DrawablePropertiesService } from 'src/app/services/index/drawable/properties/drawable-properties.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
  providers: [DrawablePropertiesService]
})
export class LineComponent implements OnInit {

  readonly name: string = Tools.Line;
  specificationForm: FormGroup;
  jointType: string;
  
  constructor(
    private shortcuts: HotkeysService,
    public service: LineService,
    private toolSelector: ToolSelectorService,
    private attributes: DrawablePropertiesService
    ) {
    this.setupShortcuts();
    this.service = this.toolSelector.getLine();
  }

  ngOnInit(): void {
    this.service.thickness = this.attributes.thickness.value;
    this.service.dotDiameter = this.attributes.dotDiameter.value;
    this.service.jointIsDot = this.attributes.junction.value;
    this.jointType = 'Aucune';
    this.service.initializeProperties(this.attributes);
  }

  setupShortcuts(): void {
    this.shortcuts.addShortcut({ keys: 'backspace', description: 'Remove last point' }).subscribe(
      (event) => {
        this.service.removeLastPoint();
      }
    );

    this.shortcuts.addShortcut({ keys: 'escape', description: 'Cancel current line' }).subscribe(
      (event) => {
        if (!this.service.getLineIsDone()) {
          this.service.deleteLine();
        }
      }
    );
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

  onDotSelected(): void {
    if (this.jointType !== 'Aucune') {
      this.attributes.junction.next(true);
    } else {
      this.attributes.junction.next(false);
    }
  }

  onDiameterChange(): void {
    if (this.service.dotDiameter < CONSTANT.DIAMETER_MINIMUM) {
      this.attributes.dotDiameter.next(CONSTANT.DIAMETER_MINIMUM)
    } else {
      if (this.service.dotDiameter > CONSTANT.DIAMETER_MAXIMUM) {
        this.attributes.dotDiameter.next(CONSTANT.DIAMETER_MAXIMUM)
      } else {
        this.attributes.dotDiameter.next(this.service.dotDiameter);
      }
    }
  }
}
