import { Component, OnInit } from '@angular/core';
import { Color } from 'src/app/classes/color';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  backgroundColor: Color;

  constructor(protected workspaceService: WorkspaceService) {};

  ngOnInit() {
    this.backgroundColor = this.workspaceService.backgroundColor;
  }

  onResize(event: any) {
    this.workspaceService.size.next(new CoordinatesXY(Math.floor(event.target.offsetWidth), Math.floor(event.target.offsetHeight)));
  }
}
