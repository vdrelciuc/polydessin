import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as CONSTANT from 'src/app/classes/constants';
import { Tools } from 'src/app/enums/tools';
import { HotkeysService } from 'src/app/services/events/shortcuts/hotkeys.service';
import { LineService } from 'src/app/services/index/drawable/line/line.service';
import { DrawablePropertiesService } from 'src/app/services/index/drawable/properties/drawable-properties.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { ColorSelectorService } from 'src/app/services/color-selector.service';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit {

  readonly name: string = Tools.Line;
  readonly THICKNESS_SLIDER_MINIMUM = CONSTANT.THICKNESS_MINIMUM;
  readonly THICKNESS_SLIDER_MAXIMUM = CONSTANT.THICKNESS_MAXIMUM;
  readonly DIAMETER_SLIDER_MINIMUM = CONSTANT.DIAMETER_MINIMUM;
  readonly DIAMETER_SLIDER_MAXIMUM = CONSTANT.DIAMETER_MAXIMUM;
  protected specificationForm: FormGroup;
  protected typeSelected: string;
  protected thickness: number;
  protected dotDiameter: number;
  protected jointType: string;

  constructor(
    private shortcuts: HotkeysService,
    public service: LineService,
    private toolSelector: ToolSelectorService,
    protected attributes: DrawablePropertiesService,
    protected colorSelectorService: ColorSelectorService
    ) {
    this.setupShortcuts();
    this.service = this.toolSelector.getLine();
  }

  ngOnInit(): void {
    this.jointType = this.service.jointIsDot ? 'Points': 'Aucune';
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
    if (this.jointType === 'Points') {
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
