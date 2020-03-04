import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ExportService } from '../../services/export/export.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})

export class ExportComponent implements AfterViewInit {

  exportFormats = ['JPEG', 'PNG', 'SVG'];
  selectedFormat: string;
  exportFilters = ['Aucun', 'Saturé', 'Négatif', 'Constraste', 'Sépia', 'Gris'];
  selectedFilter: string;
  exportTypes = ['Téléchargement', 'Courriel'];
  selectedType: string;

  @ViewChild('mydrawing', {static: false}) canvas: ElementRef;
  @ViewChild('myDownload', {static : false}) myDownload: ElementRef;

  constructor(private dialogRef: MatDialogRef<ExportComponent>,
              private exportation: ExportService
  ) { }

  ngAfterViewInit(){
    this.exportation.canvas = this.canvas.nativeElement as HTMLCanvasElement;
    this.exportation.myDownload = this.myDownload as ElementRef;
    this.selectedFormat = this.exportFormats[0];
    this.selectedFilter = this.exportFilters[0];
    this.selectedType = this.exportTypes[0];
  }
  onDialogClose() {
    this.dialogRef.close();
  }

  exportConfirmation() {
    this.onDialogClose();
    this.exportation.export(true);
  }


}
