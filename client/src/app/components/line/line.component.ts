import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as CONSTANT from 'src/app/classes/constants';
import { Tools } from 'src/app/enums/tools';
import { ColorSelectorService } from 'src/app/services/color-selector/color-selector.service';
import { HotkeysService } from 'src/app/services/hotkeys/hotkeys.service';
import { LineService } from 'src/app/services/drawable/line/line.service';
import { DrawablePropertiesService } from 'src/app/services/drawable/properties/drawable-properties.service';
import { ToolSelectorService } from 'src/app/services/tools-selector/tool-selector.service';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit, OnDestroy {

  readonly name: string = Tools.Line;
  readonly THICKNESS_SLIDER_MINIMUM: number = CONSTANT.THICKNESS_MINIMUM;
  readonly THICKNESS_SLIDER_MAXIMUM: number = CONSTANT.THICKNESS_MAXIMUM;
  readonly DIAMETER_SLIDER_MINIMUM: number = CONSTANT.DIAMETER_MINIMUM;
  readonly DIAMETER_SLIDER_MAXIMUM: number = CONSTANT.DIAMETER_MAXIMUM;
  private subscriptions: Subscription[] = [];

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

  ngOnDestroy(): void {
    this.disableShortcuts();
  }

  setupShortcuts(): void {
    this.subscriptions.push(this.shortcuts.addShortcut({ keys: 'backspace', description: 'Remove last point' }).subscribe(
        (event) => {
          this.service.removeLastPoint();
        }
      )
    );

    this.subscriptions.push(this.shortcuts.addShortcut({ keys: 'escape', description: 'Cancel current line' }).subscribe(
        (event) => {
          if (!this.service.getLineIsDone()) {
            this.service.deleteLine();
          }
        }
      )
    );
  }

  disableShortcuts(): void {
    this.subscriptions.forEach ( (subscription) => subscription.unsubscribe() );
  }

  updateJunctionType(): void {
    this.service.jointIsDot = !this.service.jointIsDot;
  }
}
