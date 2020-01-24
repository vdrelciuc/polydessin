import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as CONSTANT from 'src/app/classes/constants';
import { Tools } from 'src/app/enums/tools';
import { LineService } from 'src/app/services/index/drawable/line/line.service';
import { HotkeysService } from 'src/app/services/index/shortcuts/hotkeys.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit {

  readonly name: string = Tools.Line;
  protected specificationForm: FormGroup;
  protected typeSelected: string;

  constructor(
    private shortcuts: HotkeysService,
    protected service: LineService,
    private toolSelector: ToolSelectorService
    ) {
    this.setupShortcuts();
    this.service = this.toolSelector.getLine();
  }

  ngOnInit(): void {
  }

  setupShortcuts(): void {
    this.shortcuts.addShortcut({ keys: 'backspace', description: 'Remove last point' }).subscribe(
      (event) => {
        console.log('Backspace pressed - Remove last point');
        // this.currentStack.pop_back();
      }
    );

    this.shortcuts.addShortcut({ keys: 'escape', description: 'Cancel current line' }).subscribe(
      (event) => {
        console.log('Escape pressed - Cancel current line');
        // this.currentStack.clear();
      }
    );
  }

  onThicknessChange(): void {
    if (this.service.thickness < CONSTANT.THICKNESS_MINIMUM) {
      this.service.thickness = CONSTANT.THICKNESS_MINIMUM;
    } else {
      if (this.service.thickness > CONSTANT.THICKNESS_MAXIMUM) {
        this.service.thickness = CONSTANT.THICKNESS_MAXIMUM
      }
    }
  }

  onDiameterChange(): void {
    if (this.service.dotDiameter < CONSTANT.DIAMETER_MINIMUM) {
      this.service.dotDiameter = CONSTANT.DIAMETER_MINIMUM;
    } else {
      if (this.service.dotDiameter > CONSTANT.DIAMETER_MAXIMUM) {
        this.service.dotDiameter = CONSTANT.DIAMETER_MAXIMUM
      }
    }
  }

  onDotSelected(): void {
    if (this.typeSelected === 'Points') {
      this.service.jointIsDot = true;
    }
  }
}
