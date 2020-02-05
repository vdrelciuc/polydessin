import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Color } from 'src/app/classes/color';
import * as CONSTANTS from 'src/app/classes/constants';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements AfterViewInit, OnInit {

  selectedColor: Color;
  selectedHue: Color;

  constructor(private dialogRef: MatDialogRef<ColorPickerComponent>) {
    this.selectedColor = new Color(CONSTANTS.DEFAULT_SECONDARY_COLOR);
    this.selectedHue = new Color(CONSTANTS.DEFAULT_SECONDARY_COLOR);
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  onDialogClose() {
    this.dialogRef.close();
  }

  onConfirm() {
    // TODO
    this.onDialogClose();
  }
}
