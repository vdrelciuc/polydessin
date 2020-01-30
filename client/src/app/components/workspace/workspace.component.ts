import { Component, OnInit } from '@angular/core';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  backgroundColorHex: string;

  constructor(protected workspaceService: WorkspaceService) {
  }

  ngOnInit() {
    this.backgroundColorHex = this.workspaceService.backgroundColorHex;
  }

}
