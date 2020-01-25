import { Component, OnInit, Renderer2 } from '@angular/core';
import { EventListenerService } from 'src/app/services/events/event-listener.service';
import { SVGService } from 'src/app/services/index/svg/svg.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
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
  stack: SVGService;

  constructor(
    private workspaceService: WorkspaceService,
    private eventListener: EventListenerService,
    private manipulator: Renderer2,
    private toolSelector: ToolSelectorService
    ) { }

  ngOnInit(width: number = 800, height: number = 400, backgroundColorHex: string = 'FFFFFF') {
    this.width = width;
    this.height = height;
    this.backgroundColorHex = backgroundColorHex;
    this.toolSelector.initialize();
    this.initializeEvents();

  }

  private initializeEvents(): void {
    this.
  }

}
