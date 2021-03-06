import { Component } from '@angular/core';
import { FeatherService } from 'src/app/services/drawable/feather/feather.service';
import { ToolSelectorService } from 'src/app/services/tools-selector/tool-selector.service';

@Component({
  selector: 'app-feather',
  templateUrl: './feather.component.html',
  styleUrls: ['./feather.component.scss']
})
export class FeatherComponent {

  constructor(
    public service: FeatherService,
    private toolSelector: ToolSelectorService,
  ) {
    this.service = this.toolSelector.getFeather();
  }
}
