import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Color } from 'src/app/classes/color';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { CanvasService } from 'src/app/services/canvas.service';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { CreateNewService } from 'src/app/services/create-new.service';
import { EventListenerService } from 'src/app/services/events/event-listener.service';
import { SVGService } from 'src/app/services/index/svg/svg.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';

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
    private manipulator: Renderer2,
    private toolSelector: ToolSelectorService,
    private colorSelectorService: ColorSelectorService,
    private createNewService: CreateNewService,
    private drawStack: DrawStackService,
    private canvasService: CanvasService,
    private workspaceService: WorkspaceService
    ) { }

  ngOnInit() {
    this.filters = this.image.nativeElement.innerHTML;
    this.toolSelector.initialize(this.manipulator, this.image, this.colorSelectorService, this.drawStack);
    this.eventListener = new EventListenerService(this.image, this.toolSelector, this.manipulator);
    this.eventListener.initializeEvents();

    this.colorSelectorService.backgroundColor.subscribe((color: Color) => {
      const isSameColor = this.workspaceService.checkIfSameBackgroundColor(color);
      const border = isSameColor ? '1px dashed black' : 'none';
      this.manipulator.setAttribute(this.image.nativeElement, 'style', `background-color: ${color.getHex()};
       border-bottom: ${border};
       border-right: ${border}`);
    });

    this.createNewService.canvasSize.subscribe((canvasSize: CoordinatesXY) => {
      this.manipulator.setAttribute(this.image.nativeElement, 'width', `${canvasSize.getX()}`);
      this.manipulator.setAttribute(this.image.nativeElement, 'height', `${canvasSize.getY()}`);
      this.resetCanvas();
    })

    this.canvasService.askForLayerCount.subscribe((value: boolean) => {
      if (value) {
      this.canvasService.layerCount = (this.image.nativeElement.children.length - 1);
      }
    })

  }

  resetCanvas() {
    this.image.nativeElement.innerHTML = this.filters;
  }

}
