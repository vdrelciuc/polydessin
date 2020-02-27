import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {WarningExportComponent} from "./warning-export/warning-export.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ExportComponent>,
              private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  onDialogClose() {
    this.dialogRef.close();
  }

  exportConfirmation() {
   this.onDialogClose();
    // Export Confirmation logic goes here
  }

  onExport() {
    const warning = this.dialog.open(WarningExportComponent, { disableClose: true });
    if (warning !== undefined) {
      warning.afterClosed().subscribe((result) => {
        if (!result) {
          this.exportConfirmation();
        }
      });
    }
  }

}
