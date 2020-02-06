import { Component, OnInit} from '@angular/core';
import { Color } from 'src/app/classes/color';
import { MatDialog } from '@angular/material';
import { ColorPickerComponent } from 'src/app/components/color-picker/color-picker.component';
import { ColorType } from 'src/app/enums/color-types';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { Coords } from 'src/app/classes/coordinates';
import { CreateNewService } from 'src/app/services/create-new.service';
import { DrawerService } from 'src/app/services/side-nav-drawer/drawer.service';

const toolBoxWidth = 96
const toolDescWidth = 250;

@Component({
  selector: 'app-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.scss']
})

export class CreateNewComponent implements OnInit {

  backgroundColor: Color;
  canvasSize: Coords;

  constructor(private createNewService: CreateNewService,
              private colorSelectorService: ColorSelectorService,
              private dialog: MatDialog,
              private drawerService: DrawerService) { }

  ngOnInit() {
    this.canvasSize = new Coords(0, 0);
    this.colorSelectorService.backgroundColor.subscribe((color: Color) => {
      this.backgroundColor = color;
    });
  }

  getcanvasSizeX(): number {
    return (this.canvasSize.x ||
      window.innerWidth - toolBoxWidth - (this.drawerService.navIsOpened ? toolDescWidth : 0));
  }
  getcanvasSizeY(): number {
    return (this.canvasSize.y || window.innerHeight);
  }
  onBackgroundChange(): void {
    this.colorSelectorService.colorToChange = ColorType.Background;
    this.launchDialog();
  }

  private launchDialog(): void {
    this.dialog.open(ColorPickerComponent, { disableClose: true });
  }

  onConfirm(): void {
    this.createNewService.canvasSize.next(new Coords(this.getcanvasSizeX(), this.getcanvasSizeY()));
  }
}
