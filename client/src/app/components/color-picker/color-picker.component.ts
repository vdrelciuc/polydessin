import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Color } from 'src/app/classes/color';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {

  selectedColor: Color;
  selectedHue: Color;
  initialColor: Color;

  constructor(
    private dialogRef: MatDialogRef<ColorPickerComponent>,
    private shortcutManager: ShortcutManagerService,
    private colorSelectorService: ColorSelectorService
    ) {
      this.shortcutManager.disableShortcuts();
      this.selectedColor = this.colorSelectorService.getCurrentlySelectedColor();
      this.selectedHue = this.colorSelectorService.getCurrentlySelectedColor();
  }

  updateRed(event: any): void {
    this.selectedColor.setRedHex(event.target.value);
  }

  updateGreen(event: any): void {
    this.selectedColor.setGreenHex(event.target.value);
  }

  updateBlue(event: any): void {
    this.selectedColor.setBlueHex(event.target.value);
  }

  onDialogClose() {
    this.dialogRef.close();
    this.shortcutManager.setupShortcuts();
  }

  onConfirm() {
    this.colorSelectorService.updateColor(this.selectedColor);
    this.onDialogClose();
  }

}
