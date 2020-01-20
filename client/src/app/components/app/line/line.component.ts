import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit {

  readonly name: string = 'Line';
  specificationForm: FormGroup;

  constructor() {
  }

  ngOnInit(): void {
  }


}
