import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  width: number;
  heigth: number;

  constructor() {
  }

  ngOnInit(width: number = 800, height: number = 400) {
    this.heigth = height;
    this.width = width;
  }

}
