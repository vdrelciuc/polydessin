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

    ngOnInit() {
      this.backgroundColor = this.workspaceService.backgroundColor;
    }

    onResize(event: any) {
      this.workspaceService.Size.next(new CoordinatesXY(Math.floor(event.contentRect.width), Math.floor(event.contentRect.height)));
    }
  constructor(protected workspaceService: WorkspaceService) {
  };

}
