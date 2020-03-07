import { Component } from '@angular/core';

@Component({
  selector: 'app-error-on-save',
  templateUrl: './error-on-save.component.html',
  styleUrls: ['./error-on-save.component.scss']
})
export class ErrorOnSaveComponent  {

  errors : [boolean,  boolean, boolean];

  constructor() { }


}
