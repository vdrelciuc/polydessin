import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ImageFilter } from 'src/app/enums/color-filter';
import { ImageExportType } from 'src/app/enums/export-type';
import { ImageFormat } from 'src/app/enums/image-format';
import { ExportService } from '../../services/export/export.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})

export class ExportComponent implements AfterViewInit {

  exportFormats: string[];
  selectedFormat: string;
  exportFilters: string[];
  selectedFilter: string;
  exportTypes: string[];
  selectedExportType: string;

  formatsMap: Map<string, ImageFormat>;
  filtersMap: Map<string, ImageFilter>;
  exportTypeMap: Map<string, ImageExportType>;

  @ViewChild('mydrawing', {static: false}) canvas: ElementRef;
  @ViewChild('myDownload', {static : false}) myDownload: ElementRef;

  constructor(private dialogRef: MatDialogRef<ExportComponent>, private exportation: ExportService) {
    this.exportation.currentFilter.subscribe((filter: ImageFilter) => {
      this.selectedFilter = filter.toString();
    });
    this.exportation.currentFormat.subscribe((format: ImageFormat) => {
      this.selectedFormat = format.toString();
    });
    this.exportation.currentExportType.subscribe((exportType: ImageExportType) => {
      this.selectedExportType = exportType.toString();
    });
    this.exportFormats = Object.keys(ImageFormat);
    this.exportFilters = Object.keys(ImageFilter);
    this.exportTypes = Object.keys(ImageExportType);

    this.initializeMaps();
  }

  private initializeMaps() {
    this.formatsMap = new Map();
    this.formatsMap.set('JPEG', ImageFormat.JPEG);
    this.formatsMap.set('PNG', ImageFormat.PNG);
    this.formatsMap.set('SVG', ImageFormat.SVG);

    this.filtersMap = new Map();
    this.filtersMap.set('Aucun', ImageFilter.Aucun);
    this.filtersMap.set('Brouillard', ImageFilter.Brouillard);
    this.filtersMap.set('Négatif', ImageFilter.Négatif);
    this.filtersMap.set('Constraste', ImageFilter.Constraste);
    this.filtersMap.set('Sépia', ImageFilter.Sépia);
    this.filtersMap.set('Teinté', ImageFilter.Teinté);

    this.exportTypeMap = new Map();
    this.exportTypeMap.set('Téléchargement', ImageExportType.Téléchargement);
    this.exportTypeMap.set('Courriel', ImageExportType.Courriel);
  }

  ngAfterViewInit() {
    this.exportation.canvas = this.canvas.nativeElement as HTMLCanvasElement;
    this.exportation.myDownload = this.myDownload as ElementRef;
  }

  onFormatUpdate(newFormatString: string) {
    const newFormat = this.formatsMap.get(newFormatString);
    if (newFormat !== undefined) {
      this.exportation.currentFormat.next(newFormat);
    }
  }

  onFilterUpdate(newFilterString: string) {
    const newFilter = this.filtersMap.get(newFilterString);
    if (newFilter !== undefined) {
      console.log(newFilter.toString());
      this.exportation.currentFilter.next(newFilter);
    }
  }

  onExportTypeUpdate(newExportTypeString: string) {
    const newExportType = this.exportTypeMap.get(newExportTypeString);
    if (newExportType !== undefined) {
      this.exportation.currentExportType.next(newExportType);
    }
  }

  onDialogClose() {
    this.dialogRef.close();
  }

  exportConfirmation() {
    this.onDialogClose();
    this.exportation.export();
  }

}
