import { Component, OnInit } from '@angular/core';
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

  constructor(
    private shortcuts: HotkeysService,
    public service: LineService,
    private toolSelector: ToolSelectorService,
    protected attributes: DrawablePropertiesService,
    protected colorSelectorService: ColorSelectorService
    ) {
    
    this.service = this.toolSelector.getLine();
  }

  ngOnInit(): void {
    this.setupShortcuts();
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

  updateJunctionType(): void {
    this.service.jointIsDot = !this.service.jointIsDot;
  }
}
