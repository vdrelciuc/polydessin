import { Component, OnInit } from '@angular/core';
import { HotkeysService } from 'src/app/services/events/shortcuts/hotkeys.service';
import { SelectionService } from 'src/app/services/index/drawable/selection/selection.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit {

  constructor(
    private shortcuts: HotkeysService,
    private service: SelectionService,
    private toolSelector: ToolSelectorService
    ) {
    this.service = this.toolSelector.getSelection();
  }

  ngOnInit(): void {
    this.setupShortcuts();
  }

  ngOnDestroy(): void {
    this.service.cancelSelection();
  }

  setupShortcuts(): void {
    this.shortcuts.addShortcut({ keys: 'control.a', description: 'Select all elements on canvas' }).subscribe(
      (event) => {
        this.service.selectAllElements();
      }
    );
  }

}
