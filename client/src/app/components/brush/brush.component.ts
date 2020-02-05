import { Component, OnInit } from '@angular/core';
import { Tools } from 'src/app/enums/tools';
import { BrushService } from 'src/app/services/index/drawable/brush/brush.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { DrawablePropertiesService } from 'src/app/services/index/drawable/properties/drawable-properties.service';
import * as CONSTANT from 'src/app/classes/constants';
import { Filters } from 'src/app/components/brush/patterns';

@Component({
  selector: 'app-brush',
  templateUrl: './brush.component.html',
  styleUrls: ['./brush.component.scss']
})
export class BrushComponent implements OnInit {
  filters = Filters;
  readonly name: string = Tools.Brush;
  showFilters: boolean;

  constructor(
    protected service: BrushService,
    private toolSelector: ToolSelectorService,
    protected attributes: DrawablePropertiesService
    ) {
    this.service = this.toolSelector.getBrush();
    this.showFilters = false;
  }

  ngOnInit(): void {
    this.service.initializeProperties(this.attributes);
  }

  onThicknessChange(input: number ): void {
    if (input < CONSTANT.THICKNESS_MINIMUM) {
      this.service.thickness = (CONSTANT.THICKNESS_MINIMUM);
    } else {
      if (input > CONSTANT.THICKNESS_MAXIMUM) {
        this.service.thickness = (CONSTANT.THICKNESS_MAXIMUM);
      } else {
        this.service.thickness = (input);
      }
    }
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  changePattern(filter: string): void {
    this.service.selectedFilter = filter;
  }
}
