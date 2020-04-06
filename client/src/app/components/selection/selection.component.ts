import { Component } from '@angular/core';
import { ClipboardService } from 'src/app/services/clipboard/clipboard.service';
import { SelectionService } from 'src/app/services/drawable/selection/selection.service';
import { ToolSelectorService } from 'src/app/services/tools-selector/tool-selector.service';
import { Transform } from 'src/app/classes/transformations';

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

  selectAll() {
    this.selectionService.selectAllElements();
  }

  copy(): void {
    ClipboardService.copy();
  }

  paste(): void {
    ClipboardService.paste();
    this.selectionService.resizeGroup.remove();
    this.selectionService.pushElement();
    this.selectionService.setGeneratedAreaBorders();
  }

  cut(): void {
    ClipboardService.cut();
    this.selectionService.resizeGroup.remove();
    this.selectionService.pushElement();
    this.selectionService.setGeneratedAreaBorders();
  }

  duplicate(): void {
    ClipboardService.duplicate();
    this.selectionService.resizeGroup.remove();
    this.selectionService.pushElement();
    this.selectionService.setGeneratedAreaBorders();
  }

  delete(): void {
    Transform.delete();
    this.selectionService.resizeGroup.remove();
    this.selectionService.pushElement();
    this.selectionService.setGeneratedAreaBorders();
  }
}
