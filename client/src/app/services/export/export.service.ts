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
  originalCanvas: HTMLCanvasElement;
  myDownload: ElementRef; // where i mimic the download click
  private image: ElementRef<SVGElement>; // My actual svg
  imageAfterDeserialization: HTMLImageElement; // transformed image through formula

  private readonly REGEX_TITLE: RegExp = /^[A-Za-z0-9- ]{3,10}$/; // Alphanumeric, space and dash: 3 to 10 chars
  private readonly MAX_WIDTH: number = 300;
  private readonly MAX_HEIGHT: number = 270;

  currentFormat: BehaviorSubject<ImageFormat>;
  currentFilter: BehaviorSubject<ImageFilter>;
  currentExportType: BehaviorSubject<ImageExportType>;
  isTitleValid: BehaviorSubject<boolean>;
  filtersMap: Map<ImageFilter, string>;

  constructor() {
    this.currentFormat = new BehaviorSubject<ImageFormat>(ImageFormat.JPEG);
    this.currentFilter = new BehaviorSubject<ImageFilter>(ImageFilter.Aucun);
    this.currentExportType = new BehaviorSubject<ImageExportType>(ImageExportType.Téléchargement);
    this.isTitleValid = new BehaviorSubject<boolean>(false);
    this.initializeMap();
  }

  private initializeMap(): void {
    this.filtersMap = new Map();
    this.filtersMap.set(ImageFilter.Aucun, 'none');
    this.filtersMap.set(ImageFilter.Constraste, 'contrast(0.3)');
    this.filtersMap.set(ImageFilter.Teinté, 'hue-rotate(140deg)');
    this.filtersMap.set(ImageFilter.Négatif, 'invert(1)');
    this.filtersMap.set(ImageFilter.Sombre, 'grayscale(0.5)');
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

  export(imageTitle: string): void {
    if (this.currentFormat.getValue() === ImageFormat.SVG) {
      this.applyFilterFomSvg();
      this.downloadSVG(imageTitle);
    } else {
      const context = this.originalCanvas.getContext('2d');
      if (context !== null) {
        this.applyFilterFromCanvas(context);
        this.downloadCorrectType(imageTitle);
      }
    }
  }

  drawPreview(firstCall: boolean): void {
    const contextBinded = this.canvas.getContext('2d');
    if (contextBinded !== null) {
      contextBinded.clearRect(0, 0, contextBinded.canvas.width, contextBinded.canvas.height);
      this.applyFilterForPreview(contextBinded);
      let scaleX = this.MAX_HEIGHT / this.originalCanvas.width;
      let scaleY = (this.MAX_WIDTH / this.originalCanvas.height) / 2;
      if (scaleX > 1) {
        scaleX = 1;
      }
      if (scaleY > 1) {
        scaleY = 1;
      }
      if (firstCall) {
        contextBinded.scale(scaleX, scaleY);
      }
      contextBinded.drawImage(this.originalCanvas, 0, 0);
    }
  }

  async SVGToCanvas(): Promise<void> {
    this.deserializeImage();
    this.imageAfterDeserialization.onload = () => {
      this.originalCanvas.width = this.imageAfterDeserialization.width;
      this.originalCanvas.height = this.imageAfterDeserialization.height;
      const context = this.originalCanvas.getContext('2d');
      if (context !== null) {
        context.drawImage(this.imageAfterDeserialization, 0, 0);
      }
      this.drawPreview(true);
    };

  }

  applyFilterForPreview(ctx: CanvasRenderingContext2D): void {
    const tempFilter = this.filtersMap.get(this.currentFilter.getValue());
    if (tempFilter !== undefined) {
      ctx.filter = tempFilter;
    }
  }

  applyFilterFromCanvas(ctx: CanvasRenderingContext2D): void {
    const tempFilter = this.filtersMap.get(this.currentFilter.getValue());
    if (tempFilter !== undefined) {
      ctx.filter = tempFilter;
      ctx.drawImage(this.imageAfterDeserialization, 0, 0);
    }
  }

  // theory from https://stackoverflow.com/questions/17527713/force-browser-to-download-image-files-on-click
  downloadCorrectType(imageTitle: string): void {
    if (this.currentFormat.getValue() === ImageFormat.JPEG) {
      this.imageAfterDeserialization.src = this.originalCanvas.toDataURL('image/jpeg');
    } else if (this.currentFormat.getValue() === ImageFormat.PNG) {
      this.imageAfterDeserialization.src = this.originalCanvas.toDataURL('image/png');
    }

    this.myDownload.nativeElement.setAttribute('href', this.imageAfterDeserialization.src);
    const finalString = imageTitle + '.' + this.currentFormat.getValue().toString();
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

  downloadSVG(imageTitle: string): void {
    this.myDownload.nativeElement.setAttribute('href', this.deserializeImageToSvg());
    const finalString = imageTitle + '.svg';
    this.myDownload.nativeElement.setAttribute('download', finalString);
  }

  initialize(image: ElementRef<SVGElement>): void {
    this.image = image; // my actual SVG Element
  }

  validateTitle(title: string): void {
    this.isTitleValid.next(this.REGEX_TITLE.test(title));
  }

}
