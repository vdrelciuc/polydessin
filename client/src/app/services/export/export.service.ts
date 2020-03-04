import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ImageFilter } from 'src/app/enums/color-filter';
import { ImageExportType } from 'src/app/enums/export-type';
import { ImageFormat } from 'src/app/enums/image-format';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  cloneSVG: ElementRef<SVGElement>; // copy of SVG element to set filters on it
  canvas: HTMLCanvasElement; // where i bind my preview for canvas
  myDownload: ElementRef; // where i mimic the download click
  private image: ElementRef<SVGElement>; // My actual svg
  imageAfterDeserialization: HTMLImageElement; // transformed image through formula

  currentFormat: BehaviorSubject<ImageFormat>;
  currentFilter: BehaviorSubject<ImageFilter>;
  currentExportType: BehaviorSubject<ImageExportType>;
  filtersMap: Map<ImageFilter, string>;

  constructor() {
    this.currentFormat = new BehaviorSubject<ImageFormat>(ImageFormat.JPEG);
    this.currentFilter = new BehaviorSubject<ImageFilter>(ImageFilter.Aucun);
    this.currentExportType = new BehaviorSubject<ImageExportType>(ImageExportType.Téléchargement);
    this.initializeMap();
  }

  private initializeMap(): void {
    this.filtersMap = new Map();
    this.filtersMap.set(ImageFilter.Aucun, '');
    this.filtersMap.set(ImageFilter.Constraste, 'contrast(0.3)');
    this.filtersMap.set(ImageFilter.Teinté, 'hue-rotate(140deg)');
    this.filtersMap.set(ImageFilter.Négatif, 'invert(1)');
    this.filtersMap.set(ImageFilter.Brouillard, 'blur(5px)');
    this.filtersMap.set(ImageFilter.Sépia, 'sepia(5)');
  }

  // formula of conversion from https://spin.atomicobject.com/2014/01/21/convert-svg-to-png/
  deserializeImage(): void {
    let xml;
    this.imageAfterDeserialization = new Image();
    xml = new XMLSerializer().serializeToString(this.image.nativeElement);
    const svg64 = btoa(xml);
    const b64Start = 'data:image/svg+xml;base64,';
    const image64 = b64Start + svg64;
    this.imageAfterDeserialization.src = image64;
  }

  export(): void {
    if (this.currentFormat.getValue() === ImageFormat.SVG) {
      this.applyFilterFomSvg();
      this.downloadSVG();
    } else {
      const context = this.canvas.getContext('2d');
      if (context !== null) {
        this.applyFilterFromCanvas(context);
        this.downloadCorrectType();
      }
    }
  }

  async SVGToCanvas() {
    this.deserializeImage();
    this.imageAfterDeserialization.onload = () => {
      this.canvas.width = this.imageAfterDeserialization.width;
      this.canvas.height = this.imageAfterDeserialization.height;
      const context = this.canvas.getContext('2d');
      if (context !== null) {
        context.drawImage(this.imageAfterDeserialization, 0, 0);
      }
    }

  }

  applyFilterFromCanvas(ctx: CanvasRenderingContext2D): void {
    const tempFilter = this.filtersMap.get(this.currentFilter.getValue());
    if (tempFilter !== undefined) {
      ctx.filter = tempFilter;
      console.log(tempFilter);
      ctx.drawImage(this.imageAfterDeserialization, 0, 0);
    }
  }

  // theory from https://stackoverflow.com/questions/17527713/force-browser-to-download-image-files-on-click
  downloadCorrectType(): void {
    if (this.currentFormat.getValue() === ImageFormat.JPEG) {
      this.imageAfterDeserialization.src = this.canvas.toDataURL('image/jpeg');
    } else if (this.currentFormat.getValue() === ImageFormat.PNG) {
      this.imageAfterDeserialization.src = this.canvas.toDataURL('image/png');
    }

    this.myDownload.nativeElement.setAttribute('href', this.imageAfterDeserialization.src);
    const finalString = 'img.' + this.currentFormat.getValue().toString();
    this.myDownload.nativeElement.setAttribute('download', finalString);
  }

  // formula of conversion from https://spin.atomicobject.com/2014/01/21/convert-svg-to-png/
  deserializeImageToSvg(): string {
    let xml;
    const cloneImageAfterDeserialization = new Image();
    xml = new XMLSerializer().serializeToString(this.cloneSVG.nativeElement);
    const svg64 = btoa(xml);
    const b64Start = 'data:image/svg+xml;base64,';
    const image64 = b64Start + svg64;

    return cloneImageAfterDeserialization.src = image64;

  }

  applyFilterFomSvg(): void {
    this.cloneSVG = new ElementRef<SVGElement>(this.image.nativeElement);
    (this.cloneSVG.nativeElement as Node ) = this.image.nativeElement.cloneNode(true);
    const tempFilter = this.filtersMap.get(this.currentFilter.getValue());
    if (tempFilter !== undefined) {
      this.cloneSVG.nativeElement.setAttribute('filter', tempFilter);
    }
  }

  downloadSVG(): void {
    this.myDownload.nativeElement.setAttribute('href', this.deserializeImageToSvg());
    const finalString = 'img.svg';
    this.myDownload.nativeElement.setAttribute('download', finalString);
  }

  initialize(image: ElementRef<SVGElement>): void {
    this.image = image; // my actual SVG Element
  }

}
