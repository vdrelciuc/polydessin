import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements AfterViewInit, OnInit {

  constructor(private dialogRef: MatDialogRef<ColorPickerComponent>) { }

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
