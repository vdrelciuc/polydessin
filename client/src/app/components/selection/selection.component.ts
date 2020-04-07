import { Component } from '@angular/core';
import { Transform } from 'src/app/classes/transformations';
import { ClipboardService } from 'src/app/services/clipboard/clipboard.service';
import { SelectionService } from 'src/app/services/drawable/selection/selection.service';
import { ToolSelectorService } from 'src/app/services/tools-selector/tool-selector.service';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent {
  constructor(private selectionService: SelectionService, private toolSelector: ToolSelectorService) {
    this.selectionService = this.toolSelector.getSelection();
  }

  pasteDisabled(): boolean {
    return ClipboardService.pasteDisabled();
  }

  copyCutDupDelDisabled(): boolean {
    return this.selectionService.hasNoSelection();
  }

  selectAll(): void {
    this.selectionService.selectAllElements();
  }

  copy(): void {
    ClipboardService.copy();
  }

  paste(): void {
    ClipboardService.paste();
    this.pushSVG();
  }

  cut(): void {
    ClipboardService.cut();
    this.pushSVG();
  }

  duplicate(): void {
    ClipboardService.duplicate();
    this.pushSVG();
  }

  delete(): void {
    Transform.delete();
    this.pushSVG();
  }

  pushSVG(): void {
    this.selectionService.resizeGroup.remove();
    this.selectionService.pushElement();
    this.selectionService.setGeneratedAreaBorders();
  }
}
