import {ElementRef, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  canvas: HTMLCanvasElement; // where i bind my preview
  myDownload: ElementRef; // where i mimic the download click
  private image: ElementRef<SVGElement>; // my actual svg
  private imageAfterDeserialization: HTMLImageElement; // transformed xml blablabla


  private cloneImageAfterDeserialization: HTMLImageElement;
  clone: SVGElement;

  initialize(image: ElementRef<SVGElement>): void {
    this.image = image; // my actual SVG Element
  }

  export() {
    let context = this.canvas.getContext('2d');
    if (context !==null){
      this.applyFilterFromCanvas(context, '');
      this.downloadCorrectType('png');
    }
    //this.applyFilterFomSvg('');
   // this.downloadSVG();

  }

  deserializeImage() {
    let xml;
    this.imageAfterDeserialization = new Image();
    xml = new XMLSerializer().serializeToString(this.image.nativeElement);
    let svg64 = btoa(xml);
    let b64Start = 'data:image/svg+xml;base64,';
    let image64 = b64Start + svg64;

    this.imageAfterDeserialization.src = image64;
  }

  // formula of conversion from https://spin.atomicobject.com/2014/01/21/convert-svg-to-png/
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
    // saturate(0.3)'
    //'invert(0.5)'
    //'sepia(1)'
    //'grayscale(0.5)'
    //'contrast(0.4)'
    //''
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












  deserializeImageToSvg() {
    let xml;
    this.cloneImageAfterDeserialization = new Image();
    xml = new XMLSerializer().serializeToString(this.clone);
    let svg64 = btoa(xml);
    let b64Start = 'data:image/svg+xml;base64,';
    let image64 = b64Start + svg64;

    this.cloneImageAfterDeserialization.src = image64;

  }
  applyFilterFomSvg(filter: string) {

    this.clone.setAttribute('filter', 'invert(1)');
  }


  downloadSVG() {
    this.deserializeImageToSvg();
    this.myDownload.nativeElement.setAttribute('href', this.cloneImageAfterDeserialization.src);
    let finalString = 'img.svg';
    this.myDownload.nativeElement.setAttribute('download', finalString);
  }

}
