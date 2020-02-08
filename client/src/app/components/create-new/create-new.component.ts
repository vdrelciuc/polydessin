import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Color } from 'src/app/classes/color';
import { ColorType } from 'src/app/enums/color-types';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { CreateNewService } from 'src/app/services/create-new.service';
import { DrawerService } from 'src/app/services/side-nav-drawer/drawer.service';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { Router } from '@angular/router';

const toolBoxWidth = 96
const toolDescWidth = 250;

@Component({
  selector: 'app-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.scss']
})

export class CreateNewComponent implements OnInit {

  backgroundColor: Color;
  previewColor: Color;
  canvasSize: CoordinatesXY;

  constructor(private colorSelectorService: ColorSelectorService,
              private dialogRef: MatDialogRef<CreateNewComponent>,
              private colorDialog: MatDialog,
              private createNewService: CreateNewService,
              private drawerService: DrawerService,
              public router: Router
  ) { }

  ngOnInit() {
    this.canvasSize = new CoordinatesXY(0, 0);
    this.colorSelectorService.backgroundColor.subscribe((color: Color) => {
      this.backgroundColor = color;
    });
    this.colorSelectorService.temporaryColor.subscribe((color: Color) => {
      this.previewColor = color;
    });
  }

  getcanvasSizeX(): number {
    return (this.canvasSize.getX() ||
      window.innerWidth - toolBoxWidth - (this.drawerService.navIsOpened ? toolDescWidth : 0));
  }
  getcanvasSizeY(): number {
    return (this.canvasSize.getY() || window.innerHeight);
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
    this.createNewService.canvasSize.next(new CoordinatesXY(this.getcanvasSizeX(), this.getcanvasSizeY()));
    this.dialogRef.close();
  }

  onCloseDialog(): void {
    if (history.state.comingFromEntryPoint) {
      this.router.navigateByUrl('/')
    }
    this.dialogRef.close();
  }
}
