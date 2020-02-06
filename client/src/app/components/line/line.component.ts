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
  protected specificationForm: FormGroup;
  protected typeSelected: string;
  protected thickness: number;
  protected dotDiameter: number;

  constructor(
    private shortcuts: HotkeysService,
    protected service: LineService,
    private toolSelector: ToolSelectorService,
    protected attributes: DrawablePropertiesService
    ) {
    this.setupShortcuts();
    this.service = this.toolSelector.getLine();
  }

  ngOnInit(): void {
    this.thickness = this.attributes.thickness.value;
    this.dotDiameter = this.attributes.dotDiameter.value;
    this.service.initializeProperties(this.attributes);
    this.typeSelected = 'Aucune';
  }

  setupShortcuts(): void {
    this.shortcuts.addShortcut({ keys: 'backspace', description: 'Remove last point' }).subscribe(
      (event) => {
        console.log('Backspace pressed - Remove last point');
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
        this.attributes.thickness.next(this.thickness);
      }
    }
  }

  onDotSelected(): void {
    if (this.typeSelected === 'Points') {
      this.attributes.junction.next(true);
      this.service.jointIsDot = true;
    } else {
      this.attributes.junction.next(false);
      this.service.jointIsDot = false;
    }
  }

  onDiameterChange(): void {
    if (this.service.dotDiameter < CONSTANT.DIAMETER_MINIMUM) {
      this.attributes.dotDiameter.next(CONSTANT.DIAMETER_MINIMUM)
    } else {
      if (this.service.dotDiameter > CONSTANT.DIAMETER_MAXIMUM) {
        this.attributes.dotDiameter.next(CONSTANT.DIAMETER_MAXIMUM)
      } else {
        this.attributes.dotDiameter.next(this.dotDiameter);
      }
    }
  }
}
