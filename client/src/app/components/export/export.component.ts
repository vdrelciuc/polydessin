import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ExportComponent>) { }

  ngOnInit() {
  }

  onDialogClose() {
    this.dialogRef.close();
  }

  onConfirm() {
    this.onDialogClose();
  }

}
