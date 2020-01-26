import { Component, OnInit } from '@angular/core';
import { Tools } from 'src/app/enums/tools';
import { HotkeysService } from 'src/app/services/events/shortcuts/hotkeys.service';
import { RectangleService } from 'src/app/services/index/drawable/rectangle/rectangle.service';
import { DrawablePropertiesService } from 'src/app/services/index/drawable/properties/drawable-properties.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';

@Component({
  selector: 'app-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss']
})
export class RectangleComponent implements OnInit {

  readonly name: string = Tools.Rectangle;
  
  constructor(
    private shortcuts: HotkeysService,
    protected service: RectangleService,
    private toolSelector: ToolSelectorService,
    protected attributes: DrawablePropertiesService
    ) {
    this.service = this.toolSelector.getRectangle();
  }

  ngOnInit(): void {
    this.service.initializeProperties(this.attributes);
  }

}
