import { Injectable } from '@angular/core';
import { FilterList } from 'src/app/components/brush/patterns';
import { PencilService } from '../pencil/pencil.service';

@Injectable({
  providedIn: 'root'
})
export class BrushService extends PencilService {
  selectedFilter: string;

  constructor() {
    super();
    this.frenchName = 'Pinceau';
    this.selectedFilter = FilterList[0].referenceID;
  }

  onMousePress(event: MouseEvent): void {
    super.onMousePress(event);
    this.manipulator.setAttribute(this.line, 'filter', `url(#${this.selectedFilter})`);
  }

  protected createCircle(x: number, y: number): void {
    super.createCircle(x, y);
    this.manipulator.setAttribute(this.mousePointer, 'filter', `url(#${this.selectedFilter})`);
  }
}
