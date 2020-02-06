import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EventListenerService } from 'src/app/services/events/event-listener.service';
import { SVGService } from 'src/app/services/index/svg/svg.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { Color } from 'src/app/classes/color';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
// import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  @ViewChild('drawing', { static: true }) image: ElementRef<SVGElement>;

  width: number;
  height: number;
  stack: SVGService;
  private eventListener: EventListenerService;

  constructor(
    protected workspaceService: WorkspaceService,
    private manipulator: Renderer2,
    private toolSelector: ToolSelectorService,
    private colorSelectorService: ColorSelectorService
    ) { }

  ngOnInit(width: number = 100, height: number = 100) {
    this.width = width;
    this.height = height;
    this.toolSelector.initialize(this.manipulator, this.image);
    this.eventListener = new EventListenerService(this.image, this.toolSelector, this.manipulator);
    this.eventListener.initializeEvents();

    this.colorSelectorService.backgroundColor.subscribe((color: Color) => {
      this.manipulator.setAttribute(this.image.nativeElement, 'style', `background-color: ${color.getHex()}`);
    });
  }

}
