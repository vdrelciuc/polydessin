import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { Tools } from 'src/app/enums/tools';
import { PaintSealService } from 'src/app/services/drawable/paint-seal/paint-seal.service';
import { ToolSelectorService } from 'src/app/services/tools-selector/tool-selector.service';

@Component({
  selector: 'app-paint-seal',
  templateUrl: './paint-seal.component.html',
  styleUrls: ['./paint-seal.component.scss']
})
export class PaintSealComponent {

  readonly name: string = Tools.Bucket;

  constructor(
    public service: PaintSealService,
    private toolSelector: ToolSelectorService
    ) {
    this.service = this.toolSelector.getPaintSeal();
  }

  setTolerance(event: MatSliderChange): void {
    const value = event.value;
    if (value !== null) {
      this.service.tolerance.next(value);
    }
  }
}
