import { Component, OnInit, } from '@angular/core';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { Color } from 'src/app/classes/color';
import { Coords } from 'src/app/classes/coordinates';
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
      this.workspaceService.Size.next(new Coords(Math.floor(event.contentRect.width), Math.floor(event.contentRect.height)));
    }
  constructor(protected workspaceService: WorkspaceService) {
  };

}
