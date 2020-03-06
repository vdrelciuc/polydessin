import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-save-server',
  templateUrl: './save-server.component.html',
  styleUrls: ['./save-server.component.scss']
})
export class SaveServerComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<SaveServerComponent>) { }

  ngOnInit() {
  }

  onDialogClose() {
    this.dialogRef.close();
  }

  saveConfirmation() {
    this.onDialogClose();
    // saving logic
  }

}
