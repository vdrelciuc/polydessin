import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as CONSTANT from 'src/app/classes/constants';
import { Tools } from 'src/app/enums/tools';
// import { Stack } from 'src/app/classes/stack';
// import { DrawablePropertiesService } from 'src/app/services/index/drawable/properties/drawable-properties.service';
import { HotkeysService } from 'src/app/services/index/shortcuts/hotkeys.service';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit {

  readonly name: string = Tools.Line;
  thickness: number;
  diameter: number;
  specificationForm: FormGroup;
  typeSelected: string;
  // currentStack: SVGStack

  constructor(
    private shortcuts: HotkeysService,
    // private properties: DrawablePropertiesService
  ) {
    this.setupShortcuts();
    this.thickness = CONSTANT.THICKNESS_DEFAULT;
    this.typeSelected = 'Aucune';
    this.diameter = CONSTANT.DIAMETER_DEFAULT;

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
    if (this.thickness < CONSTANT.THICKNESS_MINIMUM) {
      this.thickness = CONSTANT.THICKNESS_MINIMUM;
    } else {
      if (this.thickness > CONSTANT.THICKNESS_MAXIMUM) {
        this.thickness = CONSTANT.THICKNESS_MAXIMUM
      }
    }
  }

  onDiameterChange(): void {
    if (this.diameter < CONSTANT.DIAMETER_MINIMUM) {
      this.diameter = CONSTANT.DIAMETER_MINIMUM;
    } else {
      if (this.diameter > CONSTANT.DIAMETER_MAXIMUM) {
        this.diameter = CONSTANT.DIAMETER_MAXIMUM
      }
    }
  }
}
