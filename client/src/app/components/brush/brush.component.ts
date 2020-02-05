import { Component, OnInit } from '@angular/core';
import * as CONSTANT from 'src/app/classes/constants';
import { Filter, FilterList } from 'src/app/components/brush/patterns';
import { Tools } from 'src/app/enums/tools';
import { BrushService } from 'src/app/services/index/drawable/brush/brush.service';
import { DrawablePropertiesService } from 'src/app/services/index/drawable/properties/drawable-properties.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';

@Component({
  selector: 'app-brush',
  templateUrl: './brush.component.html',
  styleUrls: ['./brush.component.scss']
})
export class BrushComponent implements OnInit {

  filters: Filter[];
  readonly name: string = Tools.Brush;
  showFilters: boolean;

  readonly SLIDER_MINIMUM = CONSTANT.THICKNESS_MINIMUM;
  readonly SLIDER_MAXIMUM = CONSTANT.THICKNESS_MAXIMUM;

  constructor(
    protected service: BrushService,
    private toolSelector: ToolSelectorService,
    protected attributes: DrawablePropertiesService
    ) {
    this.service = this.toolSelector.getBrush();
    this.showFilters = false;
    this.filters = FilterList;
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

  changeFilter(filter: string): void {
    this.service.selectedFilter = filter;
  }
}
