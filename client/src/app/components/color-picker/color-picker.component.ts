import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Color } from 'src/app/classes/color';
import { ColorSelectorService } from 'src/app/services/color-selector.service';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements AfterViewInit, OnInit {

  selectedColor: Color;
  selectedHue: Color;
  initialColor: Color;

  constructor(
    private dialogRef: MatDialogRef<ColorPickerComponent>,
    private colorSelectorService: ColorSelectorService) {
    this.selectedColor = this.colorSelectorService.getCurrentlySelectedColor();
    this.selectedHue = this.colorSelectorService.getCurrentlySelectedColor();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  onDialogClose() {
    this.dialogRef.close();
  }

  onConfirm() {
    this.colorSelectorService.updateColor(this.selectedColor);
    this.onDialogClose();
  }

}
