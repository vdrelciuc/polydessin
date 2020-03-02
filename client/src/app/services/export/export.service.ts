import {ElementRef, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  cloneSVG: ElementRef<SVGElement>; // copy of SVG element to set filters on it
  canvas: HTMLCanvasElement; // where i bind my preview for canvas
  myDownload: ElementRef; // where i mimic the download click
  private image: ElementRef<SVGElement>; // My actual svg
  private imageAfterDeserialization: HTMLImageElement; // transformed image through formula

  // formula of conversion from https://spin.atomicobject.com/2014/01/21/convert-svg-to-png/
  deserializeImage() {
    let xml;
    this.imageAfterDeserialization = new Image();
    xml = new XMLSerializer().serializeToString(this.image.nativeElement);
    let svg64 = btoa(xml);
    let b64Start = 'data:image/svg+xml;base64,';
    let image64 = b64Start + svg64;
    this.imageAfterDeserialization.src = image64;
  }

  export(isSvg: boolean) {
    if (!isSvg) {
      let context = this.canvas.getContext('2d');
      if (context !== null) {
        this.applyFilterFromCanvas(context, '');
        this.downloadCorrectType('png');
      }
    } else {
      this.applyFilterFomSvg('');
      this.downloadSVG();
    }
  }

  async SVGToCanvas() {
    this.deserializeImage();
    this.imageAfterDeserialization.onload = () => {
      this.canvas.width = this.imageAfterDeserialization.width;
      this.canvas.height = this.imageAfterDeserialization.height;
      let context = this.canvas.getContext('2d');
      if (context !== null) {
        context.drawImage(this.imageAfterDeserialization, 0, 0);
      }
    }

  }

  applyFilterFromCanvas(ctx: CanvasRenderingContext2D, filterFromMap: string) {
    //let filters = ['saturate(0.3)', 'invert(0.5)', 'sepia(1)', 'grayscale(0.5)' , 'contrast(0.4)' , '' ];
    ctx.filter = filterFromMap;
    ctx.drawImage(this.imageAfterDeserialization, 0, 0);
  }

  downloadCorrectType(type: string) {
    if (type === 'jpg') {
      this.imageAfterDeserialization.src = this.canvas.toDataURL('image/jpeg');
    } else if (type === 'png') {
      this.imageAfterDeserialization.src = this.canvas.toDataURL('image/png');
    }
    // theory from https://stackoverflow.com/questions/17527713/force-browser-to-download-image-files-on-click
    this.myDownload.nativeElement.setAttribute('href', this.imageAfterDeserialization.src);
    let finalString = 'img.' + type;
    this.myDownload.nativeElement.setAttribute('download', finalString);
  }

  // formula of conversion from https://spin.atomicobject.com/2014/01/21/convert-svg-to-png/
  deserializeImageToSvg() :string {
    let xml;
    let cloneImageAfterDeserialization = new Image();
    xml = new XMLSerializer().serializeToString(this.cloneSVG.nativeElement);
    let svg64 = btoa(xml);
    let b64Start = 'data:image/svg+xml;base64,';
    let image64 = b64Start + svg64;

    return cloneImageAfterDeserialization.src = image64;

  }

  applyFilterFomSvg(filter: string) {
    this.cloneSVG = new ElementRef<SVGElement>(this.image.nativeElement);
    (this.cloneSVG.nativeElement as Node ) = this.image.nativeElement.cloneNode(true);
    this.cloneSVG.nativeElement.setAttribute('filter', 'blur(5px)');
  }


  downloadSVG() {
    this.myDownload.nativeElement.setAttribute('href', this.deserializeImageToSvg());
    let finalString = 'img.svg';
    this.myDownload.nativeElement.setAttribute('download', finalString);
  }

  initialize(image: ElementRef<SVGElement>): void {
    this.image = image; // my actual SVG Element
  }

}
