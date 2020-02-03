import { Component, OnInit } from '@angular/core';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { Color } from 'src/app/classes/color';

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
