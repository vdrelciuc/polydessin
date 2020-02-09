import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DrawerService } from '../../services/side-nav-drawer/drawer.service';
import { CreateNewComponent } from '../create-new/create-new.component';

@Component({
  selector: 'app-working-area',
  templateUrl: './working-area.component.html',
  styleUrls: ['./working-area.component.scss']
})
export class WorkingAreaComponent implements OnInit {

  constructor(private drawerService: DrawerService, public route: Router, protected dialog: MatDialog) {
  }

  ngOnInit() {
    if (history.state.comingFromEntryPoint) {
      this.dialog.open(CreateNewComponent, { disableClose: true });
    }
  }

  getDrawerStatus(): boolean {
    return this.drawerService.navIsOpened;
  }

}
