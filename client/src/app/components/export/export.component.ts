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
  title: string;
  isTitleValid: boolean;

  formatsMap: Map<string, ImageFormat>;
  filtersMap: Map<string, ImageFilter>;
  exportTypeMap: Map<string, ImageExportType>;

  @ViewChild('mydrawing', {static: false}) canvas: ElementRef;
  @ViewChild('myDownload', {static : false}) myDownload: ElementRef;
  @ViewChild('proccessingCanas', {static : false}) proccessingCanas: ElementRef;

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
    this.exportation.isTitleValid.subscribe((validity: boolean) => {
      this.isTitleValid = validity;
    });
    this.exportFormats = Object.keys(ImageFormat);
    this.exportFilters = Object.keys(ImageFilter);
    this.exportTypes = Object.keys(ImageExportType);

    this.initializeMaps();
  }

  private initializeMaps(): void {
    this.formatsMap = new Map();
    this.formatsMap.set('JPEG', ImageFormat.JPEG);
    this.formatsMap.set('PNG', ImageFormat.PNG);
    this.formatsMap.set('SVG', ImageFormat.SVG);

    this.filtersMap = new Map();
    this.filtersMap.set('Aucun', ImageFilter.Aucun);
    this.filtersMap.set('Sombre', ImageFilter.Sombre);
    this.filtersMap.set('Négatif', ImageFilter.Négatif);
    this.filtersMap.set('Constraste', ImageFilter.Constraste);
    this.filtersMap.set('Sépia', ImageFilter.Sépia);
    this.filtersMap.set('Teinté', ImageFilter.Teinté);

    this.exportTypeMap = new Map();
    this.exportTypeMap.set('Téléchargement', ImageExportType.Téléchargement);
    this.exportTypeMap.set('Courriel', ImageExportType.Courriel);
  }

  ngAfterViewInit(): void {
    this.exportation.canvas = this.canvas.nativeElement as HTMLCanvasElement;
    this.exportation.myDownload = this.myDownload as ElementRef;
    this.exportation.originalCanvas = this.proccessingCanas.nativeElement;
  }

  onFormatUpdate(newFormatString: string): void {
    const newFormat = this.formatsMap.get(newFormatString);
    if (newFormat !== undefined) {
      this.exportation.currentFormat.next(newFormat);
    }
  }

  onFilterUpdate(newFilterString: string): void {
    const newFilter = this.filtersMap.get(newFilterString);
    if (newFilter !== undefined) {
      this.exportation.currentFilter.next(newFilter);
      this.exportation.drawPreview(false);
    }
  }

  onExportTypeUpdate(newExportTypeString: string): void {
    const newExportType = this.exportTypeMap.get(newExportTypeString);
    if (newExportType !== undefined) {
      this.exportation.currentExportType.next(newExportType);
    }
  }

  onDialogClose(): void {
    this.dialogRef.close();
  }

  exportConfirmation(): void {
    this.onDialogClose();
    this.exportation.export(this.title);
  }

  onTitleUpdate(event: any): void {
    if (event.target !== null) {
      this.exportation.validateTitle(event.target.value);
    }
  }

}
