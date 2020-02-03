import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DrawerService } from '../../services/side-nav-drawer/drawer.service';

@Component({
  selector: 'app-working-area',
  templateUrl: './working-area.component.html',
  styleUrls: ['./working-area.component.scss']
})
export class WorkingAreaComponent {

  constructor(private drawerService: DrawerService, public route: Router) { }

  ngOnInit() {}

  getDrawerStatus(): boolean {
    return this.drawerService.navIsOpened;
  }

}
