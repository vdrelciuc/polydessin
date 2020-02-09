import { Component, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { Color } from 'src/app/classes/color';
import { DEFAULT_SECONDARY_COLOR } from 'src/app/classes/constants';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { ColorType } from 'src/app/enums/color-types';
import { CanvasService } from 'src/app/services/canvas.service';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { CreateNewService } from 'src/app/services/create-new.service';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { WarningDialogComponent } from './warning-dialog/warning-dialog.component';

@Component({
  selector: 'app-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.scss']
})

export class CreateNewComponent implements OnInit {

  backgroundColor: Color;
  previewColor: Color;
  canvasSize: CoordinatesXY;
  workspaceSize: CoordinatesXY;
  widthChanged: boolean;
  heightChanged: boolean;

  constructor(private colorSelectorService: ColorSelectorService,
              private dialogRef: MatDialogRef<CreateNewComponent>,
              private dialog: MatDialog,
              private createNewService: CreateNewService,
              private workspaceService: WorkspaceService,
              private canvasService: CanvasService,
              public router: Router
              ) { }

  ngOnInit() {
    this.canvasService.askForLayerCount.next(true);
    this.canvasSize = new CoordinatesXY(0, 0);
    this.widthChanged = false;
    this.heightChanged = false;
    this.colorSelectorService.backgroundColor.subscribe((color: Color) => {
      this.backgroundColor = color;
    });
    this.colorSelectorService.temporaryColor.subscribe((color: Color) => {
      this.previewColor = color;
    });
    this.colorSelectorService.temporaryColor.next(new Color(DEFAULT_SECONDARY_COLOR))
    if (this.canvasService.layerCount > 0) {
      this.openDialogWarning();
    }
    this.workspaceService.Size.subscribe((size: CoordinatesXY) => {
      this.workspaceSize = size;
    })
  }

  getcanvasSizeX(): number {
    return (this.widthChanged ? this.canvasSize.getX() : this.workspaceSize.getX());
  }
  getcanvasSizeY(): number {
    return (this.heightChanged ? this.canvasSize.getY() : this.workspaceSize.getY());
  }
  setcanvasSizeX(event: any) {
    this.canvasSize.setX(event.target.value);
    this.widthChanged = true;
  }
  setcanvasSizeY(event: any) {
    this.canvasSize.setY(event.target.value);
    this.widthChanged = false;
  }

  onColorSelect(): void {
    this.colorSelectorService.colorToChange = ColorType.Preview;
    this.colorSelectorService.updateColor(this.previewColor);
    this.launchColorDialog();
  }

  private launchColorDialog(): void {
    this.dialog.open(ColorPickerComponent, { disableClose: true });
  }

  onConfirm(): void {
    this.colorSelectorService.colorToChange = ColorType.Background;
    this.colorSelectorService.updateColor(this.previewColor);
    this.createNewService.canvasSize.next(new CoordinatesXY(this.getcanvasSizeX(), this.getcanvasSizeY()));
    this.dialogRef.close();
    history.state.comingFromEntryPoint = false;
  }

  onCloseDialog(): void {
    this.dialogRef.close();
    if (history.state.comingFromEntryPoint) {
      this.router.navigateByUrl('/')
    }
  }

  openDialogWarning(): void {
    const warning = this.dialog.open(WarningDialogComponent, { disableClose: true });

    warning.afterClosed().subscribe((result) => {
      if (result === true) {
        this.onCloseDialog();
      }
    });
  }
}
