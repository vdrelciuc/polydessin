import { Component, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Color } from 'src/app/classes/color';
import { DEFAULT_SECONDARY_COLOR } from 'src/app/classes/constants';
import { Coords } from 'src/app/classes/coordinates';
import { ColorType } from 'src/app/enums/color-types';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { CreateNewService } from 'src/app/services/create-new.service';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { DrawerService } from 'src/app/services/side-nav-drawer/drawer.service';

const toolBoxWidth: number = 96
const toolBoxDescWidth: number = 250;
@Component({
  selector: 'app-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.scss']
})

export class CreateNewComponent implements OnInit {

  backgroundColor: Color;
  previewColor: Color;
  canvasSize: Coords;
  workspaceSize: Coords;
  widthIsOk: boolean;
  heightIsOk: boolean;

  constructor(private colorSelectorService: ColorSelectorService,
              private dialogRef: MatDialogRef<CreateNewComponent>,
              private colorDialog: MatDialog,
              private createNewService: CreateNewService,
              private workspaceService: WorkspaceService,
              private drawerService: DrawerService) { }

  ngOnInit() {
    this.canvasSize = new Coords(0, 0);
    this.widthIsOk = true;
    this.heightIsOk = true;
    this.colorSelectorService.backgroundColor.subscribe((color: Color) => {
      this.backgroundColor = color;
    });
    this.colorSelectorService.temporaryColor.subscribe((color: Color) => {
      this.previewColor = color;
    });
    this.colorSelectorService.temporaryColor.next(new Color(DEFAULT_SECONDARY_COLOR))
    this.workspaceService.Size.subscribe((size: Coords) => {
      this.workspaceSize = size;
    })
  }

  getcanvasSizeX(): number {
    return (this.canvasSize.x || window.innerWidth - toolBoxWidth - (this.drawerService.navIsOpened ? toolBoxDescWidth : 0));
  }
  getcanvasSizeY(): number {
    return (this.canvasSize.y || window.innerHeight);
  }
  setcanvasSizeX(event: any) {
    if (event.target.value > 0) {
      this.widthIsOk = true;
      this.canvasSize.x = event.target.value;
    } else {
      this.widthIsOk = false;
    }
  }
  setcanvasSizeY(event: any) {
    if (event.target.value > 0) {
      this.heightIsOk = true;
      this.canvasSize.y = event.target.value;
    } else {
      this.heightIsOk = false;
    }
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
    this.createNewService.canvasSize.next(new Coords(this.getcanvasSizeX(), this.getcanvasSizeY()));
    this.onCloseDialog();
  }

  onCloseDialog(): void {
    this.dialogRef.close();
  }
}
