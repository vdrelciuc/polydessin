import { Component, OnInit} from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Color } from 'src/app/classes/color';
import { Coords } from 'src/app/classes/coordinates';
import { ColorType } from 'src/app/enums/color-types';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { ColorPickerComponent } from '../color-picker/color-picker.component';

const toolBoxWidth: number = 96 + 250;

@Component({
  selector: 'app-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.scss']
})

export class CreateNewComponent implements OnInit {

  backgroundColor: Color;
  previewColor: Color;
  canvasSize: Coords;

  constructor(private colorSelectorService: ColorSelectorService,
              private dialogRef: MatDialogRef<CreateNewComponent>,
              private colorDialog: MatDialog) { }

  ngOnInit() {
    this.canvasSize = new Coords(0, 0);
    this.colorSelectorService.backgroundColor.subscribe((color: Color) => {
      this.backgroundColor = color;
    });
    this.colorSelectorService.temporaryColor.subscribe((color: Color) => {
      this.previewColor = color;
    });
  }

  getcanvasSizeX(): number {
    return (this.canvasSize.x || window.innerWidth - toolBoxWidth);
  }
  getcanvasSizeY(): number {
    return (this.canvasSize.y || window.innerHeight);
  }
  onColorSelect(): void {
    this.colorSelectorService.colorToChange = ColorType.Preview;
    this.colorSelectorService.updateColor(this.previewColor);
    this.launchDialog();
  }

  private launchDialog(): void {
    this.colorDialog.open(ColorPickerComponent, { disableClose: true });
  }

  onConfirm(): void {
    this.colorSelectorService.colorToChange = ColorType.Background;
    this.colorSelectorService.updateColor(this.previewColor);
    this.onCloseDialog();
  }

  onCloseDialog(): void {
    this.dialogRef.close();
  }
}
