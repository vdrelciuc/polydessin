import { Component, OnInit } from '@angular/core';
import { HotkeysService } from 'src/app/services/events/shortcuts/hotkeys.service';
import { SelectionService } from 'src/app/services/index/drawable/selection/selection.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { Tools } from 'src/app/enums/tools';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit {

  private static crtlShortcut: Subscription;

  constructor(
    private shortcuts: HotkeysService,
    private service: SelectionService,
    private toolSelector: ToolSelectorService
    ) {
    this.service = this.toolSelector.getSelection();
  }

  ngOnInit(): void {
    if (SelectionComponent.crtlShortcut === undefined) {
      this.setupShortcuts();
    }
  }

  ngOnDestroy(): void {
    this.service.cancelSelection();
  }

  setupShortcuts(): void {
    SelectionComponent.crtlShortcut = this.shortcuts.addShortcut({ keys: 'control.a', description: 'Select all elements on canvas' }).subscribe(
      (event) => {
        if (this.toolSelector.$currentTool.getValue() !== Tools.Selection) {
          this.toolSelector.setCurrentTool(Tools.Selection);
        }
        this.service.selectAllElements();
      }
    );
  }

}
