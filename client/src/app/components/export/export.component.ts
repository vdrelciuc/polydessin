import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {ExportService} from "../../services/export/export.service";


@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})

export class ExportComponent implements AfterViewInit {

  @ViewChild('mydrawing',{static:false}) canvas : ElementRef;
  @ViewChild('myDownload', {static : false}) myDownload: ElementRef;

  constructor(private dialogRef: MatDialogRef<ExportComponent>,
              private exportation : ExportService
  ) { }

  ngAfterViewInit(){
    this.exportation.canvas = this.canvas.nativeElement;
    this.exportation.myDownload = this.myDownload;
  }
  onDialogClose() {
    this.dialogRef.close();
  }

  exportConfirmation() {
    this.onDialogClose();
    this.exportation.export(true);
  }
}
