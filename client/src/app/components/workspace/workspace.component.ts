import { Component, OnInit } from '@angular/core';
import { Color } from 'src/app/classes/color';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {

  backgroundColor: Color;

  constructor(protected workspaceService: WorkspaceService) {
  }

  ngOnInit() {
    this.backgroundColor = this.workspaceService.backgroundColor;
  }

}
