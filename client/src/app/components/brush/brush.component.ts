import { Component } from '@angular/core';
import * as CONSTANT from 'src/app/classes/constants';
import { Filter, FilterList } from 'src/app/components/brush/patterns';
import { Tools } from 'src/app/enums/tools';
import { ColorSelectorService } from 'src/app/services/color-selector/color-selector.service';
import { BrushService } from 'src/app/services/index/drawable/brush/brush.service';
import { DrawablePropertiesService } from 'src/app/services/index/drawable/properties/drawable-properties.service';
import { ToolSelectorService } from 'src/app/services/tools-selector/tool-selector.service';

@Component({
  selector: 'app-brush',
  templateUrl: './brush.component.html',
  styleUrls: ['./brush.component.scss']
})
export class BrushComponent {

  filters: Filter[];
  readonly name: string = Tools.Brush;
  showFilters: boolean;
  selectedOption: Filter;

  readonly SLIDER_MINIMUM: number = CONSTANT.THICKNESS_MINIMUM;
  readonly SLIDER_MAXIMUM: number = CONSTANT.THICKNESS_MAXIMUM;

  constructor(
    public service: BrushService,
    private toolSelector: ToolSelectorService,
    protected attributes: DrawablePropertiesService,
    protected colorSelectorService: ColorSelectorService
    ) {
    this.service = this.toolSelector.getBrush();
    this.showFilters = false;
    this.filters = FilterList;
    this.selectedOption = this.filters[0];
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

  changeFilter(filter: Filter): void {
    this.service.selectedFilter = filter.referenceID;
    this.selectedOption = filter;
  }
}
