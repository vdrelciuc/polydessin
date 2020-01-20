import { Component, OnInit } from '@angular/core';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  width: number;
  height: number;
  backgroundColorHex: string;

  constructor(private workspaceService: WorkspaceService) { }

  ngOnInit(width: number = 800, height: number = 400, backgroundColorHex: string = 'FFFFFF') {
    this.width = width;
    this.height = height;
    this.backgroundColorHex = backgroundColorHex;
    console.log(this.workspaceService.backgroundColorHex);
  }

}
