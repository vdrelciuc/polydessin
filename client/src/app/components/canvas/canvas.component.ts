import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  width: number;
  height: number;

  constructor() { }

  ngOnInit(width: number = 200, height: number = 200) {
    this.width = width;
    this.height = height;
  }

}
