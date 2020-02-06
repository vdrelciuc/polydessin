import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Color } from 'src/app/classes/color';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { EventListenerService } from 'src/app/services/events/event-listener.service';
import { SVGService } from 'src/app/services/index/svg/svg.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { CreateNewService } from 'src/app/services/create-new.service';
import { Coords } from 'src/app/classes/coordinates';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  @ViewChild('drawing', { static: true }) image: ElementRef<SVGElement>;
  filters: string;
  width: number;
  height: number;
  stack: SVGService;
  private eventListener: EventListenerService;

  constructor(
    protected workspaceService: WorkspaceService,
    private manipulator: Renderer2,
    private toolSelector: ToolSelectorService,
    private colorSelectorService: ColorSelectorService,
    private createNewService: CreateNewService
    ) { }

  ngOnInit() {
    this.filters = this.image.nativeElement.innerHTML;
    this.toolSelector.initialize(this.manipulator, this.image);
    this.eventListener = new EventListenerService(this.image, this.toolSelector, this.manipulator);
    this.eventListener.initializeEvents();

    this.colorSelectorService.backgroundColor.subscribe((color: Color) => {
      this.manipulator.setAttribute(this.image.nativeElement, 'style', `background-color: ${color.getHex()}`);
    });

    this.createNewService.canvasSize.subscribe((canvasSize: Coords) => {
      this.manipulator.setAttribute(this.image.nativeElement, 'width', `${canvasSize.x}`);
      this.manipulator.setAttribute(this.image.nativeElement, 'height', `${canvasSize.y}`);
      this.resetCanvas();
    })
  }

  resetCanvas() {
    this.image.nativeElement.innerHTML = this.filters;
  }

}
