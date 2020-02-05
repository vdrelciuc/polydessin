/**
 * Copyright notice: Component adapted from Lukas Marx's work
 * https://malcoded.com/posts/angular-color-picker/
 */

import { AfterViewInit, Component, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { Color } from 'src/app/classes/color';
import * as CONSTANTS from 'src/app/classes/constants';

const CANVAS_CONTEXT = '2d';
const INDICATOR_LENGTH = 5;

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss']
})
export class ColorSliderComponent implements AfterViewInit {

  @Output()
  newHue: EventEmitter<Color>;

  @ViewChild('canvas', {static: true})
  canvas: any;

  private ctx: CanvasRenderingContext2D;
  private currentSelectedHeight: number;
  private isMouseDown: boolean;

  constructor() {
    this.newHue = new EventEmitter();
    this.isMouseDown = false;
   }

  ngAfterViewInit(): void {
    this.display();
  }

  private display(): void {
    // Initialize ctx
    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext(CANVAS_CONTEXT);
    }

    // Set palette dimensions to canvas size
    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;

    // Create the color gradient
    const colorGradient = this.ctx.createLinearGradient(0, 0, 0, height);
    colorGradient.addColorStop(0, 'red');
    colorGradient.addColorStop(0.17, 'yellow');
    colorGradient.addColorStop(0.34, 'green');
    colorGradient.addColorStop(0.51, 'cyan');
    colorGradient.addColorStop(0.68, 'blue');
    colorGradient.addColorStop(0.85, 'magenta');
    colorGradient.addColorStop(1, 'red');

    // Draw the container
    this.ctx.beginPath();
    this.ctx.rect(0, 0, width, height);

    // Fill the container with the color gradient
    this.ctx.fillStyle = colorGradient;
    this.ctx.fill();
    this.ctx.closePath();

    // Draw a visual indicator surrounding the selected hue
    if (this.currentSelectedHeight) {
      this.ctx.lineWidth = 4;
      this.ctx.strokeStyle = 'white';

      this.ctx.beginPath();
      this.ctx.moveTo(0, this.currentSelectedHeight);
      this.ctx.lineTo(0 + INDICATOR_LENGTH, this.currentSelectedHeight);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(width, this.currentSelectedHeight);
      this.ctx.lineTo(width - INDICATOR_LENGTH, this.currentSelectedHeight);
      this.ctx.stroke();
    }
  }

  private getColorAtPosition(y: number): Color {
    const imageData = this.ctx.getImageData(20, y, 1, 1).data;
    const color = new Color();
    color.setRedHex(imageData[0].toString(CONSTANTS.HEX_BASE));
    color.setBlueHex(imageData[1].toString(CONSTANTS.HEX_BASE))
    color.setGreenHex(imageData[2].toString(CONSTANTS.HEX_BASE))
    return color;
  }

  emitHue(y: number): void {
    const hueToEmit = this.getColorAtPosition(y);
    this.newHue.emit(hueToEmit);
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent): void {
    this.isMouseDown = false;
  }

  onMouseMove(evt: MouseEvent): void {
    if (this.isMouseDown) {
      this.currentSelectedHeight = evt.offsetY;
      this.display();
      this.emitHue(evt.offsetY);
    }
  }

  onMouseDown(evt: MouseEvent): void {
    this.isMouseDown = true;
    this.currentSelectedHeight = evt.offsetY;
    this.display();
    this.newHue.emit(this.getColorAtPosition(evt.offsetY));
  }
}
