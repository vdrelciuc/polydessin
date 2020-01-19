import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit {

  readonly THICKNESS_MINIMUM: number = 1;
  readonly THICKNESS_DEFAULT: number = 5;
  readonly THICKNESS_MAXIMUM: number = 10;
  readonly name: string = 'Line';
  specificationForm: FormGroup;

  constructor() {
  }

  ngOnInit(): void {
  }


}
