import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Color } from 'src/app/classes/color';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { CanvasService } from 'src/app/services/canvas/canvas.service';
import { ColorSelectorService } from 'src/app/services/color-selector/color-selector.service';
import { CreateNewService } from 'src/app/services/create-new/create-new.service';
import { EventListenerService } from 'src/app/services/events/event-listener.service';
import { ExportService } from 'src/app/services/export/export.service';
import { GridService } from 'src/app/services/index/drawable/grid/grid.service';
import { SVGService } from 'src/app/services/index/svg/svg.service';
import { DrawStackService } from 'src/app/services/draw-stack/draw-stack.service';
import { ToolSelectorService } from 'src/app/services/tools-selector/tool-selector.service';
import { WorkspaceService } from 'src/app/services/workspace/workspace.service';
import {GalleryService} from '../../services/gallery/gallery.service';
import {SaveServerService} from '../../services/save-server/save-server.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  @ViewChild('drawing', { static: true }) image: ElementRef<SVGElement>;
  @ViewChild('grid', { static: true }) grid: ElementRef<SVGElement>;
  @ViewChild('rect', { static: true }) rectangle: ElementRef<SVGRectElement>;
  @ViewChild('canvas', { static: true }) invisibleCanvas: ElementRef<HTMLCanvasElement>;
  filters: string;
  width: number;
  height: number;
  stack: SVGService;
  thickness: number;
  opacity: number;
  gridService: GridService;
  visible: boolean;
  private eventListener: EventListenerService;

  constructor(
    private manipulator: Renderer2,
    private toolSelector: ToolSelectorService,
    private colorSelectorService: ColorSelectorService,
    private createNewService: CreateNewService,
    private drawStack: DrawStackService,
    private canvasService: CanvasService,
    private workspaceService: WorkspaceService,
    private exportService: ExportService,
    private saveService: SaveServerService,
    private galleryService: GalleryService) {
      this.visible = true;
    }

  ngOnInit(): void {
    this.filters = this.image.nativeElement.innerHTML;
    this.toolSelector.initialize(this.manipulator, this.image, this.colorSelectorService, this.drawStack, this.invisibleCanvas);
    this.exportService.initialize(this.image);
    this.eventListener = new EventListenerService(this.image, this.toolSelector, this.manipulator);
    this.eventListener.initializeEvents();
    this.gridService = this.toolSelector.getGrid();
    this.saveService.refToSvg = this.image;
    this.galleryService.refToSvg = this.image;

    this.colorSelectorService.backgroundColor.subscribe((color: Color) => {
      const isSameColor = this.workspaceService.checkIfSameBackgroundColor(color);
      const border = isSameColor ? '1px dashed black' : 'none';
      this.manipulator.setAttribute(this.image.nativeElement, 'style', `background-color: ${color.getHex()};
       border-bottom: ${border};
       border-right: ${border}`);
      this.manipulator.setAttribute(this.grid.nativeElement, SVGProperties.color, color.getInvertedColor(true).getHex());
    });

    this.createNewService.canvasSize.subscribe((canvasSize: CoordinatesXY) => {
      this.manipulator.setAttribute(this.image.nativeElement     , SVGProperties.width , `${canvasSize.getX()}`);
      this.manipulator.setAttribute(this.image.nativeElement     , SVGProperties.height, `${canvasSize.getY()}`);
      this.manipulator.setAttribute(this.grid.nativeElement      , SVGProperties.width , `${canvasSize.getX()}`);
      this.manipulator.setAttribute(this.grid.nativeElement      , SVGProperties.height, `${canvasSize.getY()}`);
      this.manipulator.setAttribute(this.rectangle.nativeElement , SVGProperties.width , `${canvasSize.getX()}`);
      this.manipulator.setAttribute(this.rectangle.nativeElement , SVGProperties.height, `${canvasSize.getY()}`);
      this.resetCanvas();
      if (this.toolSelector.memory !== undefined) {
        this.toolSelector.memory.clear();
      }
    });

    this.gridService.thickness.subscribe( (value) => {
      this.thickness = value;
    });

    this.gridService.opacity.subscribe ( (value) => {
      this.opacity = value;
    });

    this.gridService.visible.subscribe ( (value) => {
      if (value) {
        this.grid.nativeElement.setAttribute(SVGProperties.visibility, 'visible');
      } else {
        this.grid.nativeElement.setAttribute(SVGProperties.visibility, 'hidden');
      }
    });

    this.canvasService.askForLayerCount.subscribe((value: boolean) => {
      if (value) {
      this.canvasService.layerCount = (this.image.nativeElement.children.length - 1);
      }
    });
  }

  resetCanvas(): void {
    this.image.nativeElement.innerHTML = this.filters;
  }

}
