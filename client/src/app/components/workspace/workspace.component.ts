import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { Color } from 'src/app/classes/color';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  @ViewChild('workspace', { static: true }) workspace: ElementRef<HTMLDivElement>;
  backgroundColor: Color;

    ngOnInit() {
      this.backgroundColor = this.workspaceService.backgroundColor;
    }

  constructor(protected workspaceService: WorkspaceService) {
  };

}
