import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HotkeysService } from 'src/app/services/index/shortcuts/hotkeys.service';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit {

  readonly name: string = 'Line';
  specificationForm: FormGroup;

  constructor(
    private shortcuts: HotkeysService
  ) {
    this.setupShortcuts();
  }

  ngOnInit(): void {

  }

  setupShortcuts(): void {
    this.shortcuts.addShortcut({ keys: 'backspace', description: 'Remove last point' }).subscribe(
      (event)=>{
        console.log('Backspace pressed - Remove last point');
      }
    );

    this.shortcuts.addShortcut({ keys: 'escape', description: 'Cancel current line' }).subscribe(
      (event)=>{
        console.log('Escape pressed - Cancel current line');
      }
    );
  }


}
