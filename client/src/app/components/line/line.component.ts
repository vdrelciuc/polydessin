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
  readonly THICKNESS_SLIDER_MINIMUM = CONSTANT.THICKNESS_MINIMUM;
  readonly THICKNESS_SLIDER_MAXIMUM = CONSTANT.THICKNESS_MAXIMUM;
  readonly DIAMETER_SLIDER_MINIMUM = CONSTANT.DIAMETER_MINIMUM;
  readonly DIAMETER_SLIDER_MAXIMUM = CONSTANT.DIAMETER_MAXIMUM;
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

  onDotSelected(): void {
    if (this.typeSelected === 'Points') {
      this.attributes.junction.next(true);
      this.service.jointIsDot = true;
    } else {
      this.attributes.junction.next(false);
      this.service.jointIsDot = false;
    }
  }
}
