import { Component, OnInit } from '@angular/core';
import { Tools } from '../../enums/tools';
import { ToolSelectorService } from '../../services/tools/tool-selector.service';

@Component({
  selector: 'app-option-pannel',
  templateUrl: './option-pannel.component.html',
  styleUrls: ['./option-pannel.component.scss']
})
export class OptionPannelComponent implements OnInit {
  currentTool: Tools;

  constructor(private toolSelectorService: ToolSelectorService) { }

  ngOnInit() {
    this.setTool();
  }

  setTool(): void {
    this.toolSelectorService.$currentTool.subscribe((tool: Tools) => {
      this.currentTool = tool;
    });
  }
}
