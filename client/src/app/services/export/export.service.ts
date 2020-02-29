import {ElementRef, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  private image: ElementRef<SVGElement>;
  canvas: HTMLCanvasElement;
  myDownload: ElementRef;

  initialize(image: ElementRef<SVGElement>): void {
    this.image = image;
  }

  svgToCanvas() {
    // let possibleFormats = ['JPEG', 'SVG', 'PNG'];
    let ctx = this.canvas.getContext('2d');
    // formula of conversion from https://jsfiddle.net/Wijmo5/h2L3gw88/
    let img = new Image();

    var xml = new XMLSerializer().serializeToString(this.image.nativeElement);
    var svg64 = btoa(xml);
    var b64Start = 'data:image/svg+xml;base64,';
    var image64 = b64Start + svg64;

    img.src = image64;

    img.onload = function () {
      if (ctx !== null) {
        ctx.drawImage(img, 0, 0);
        let png = ctx.canvas.toDataURL();
        console.log(png);
      }

    }


  }


  downloadCorrectType(type: string, src: string) {
    console.log(src);
    if (type === "svg") {
      // TODO move Png to Enum
      // theory from https://stackoverflow.com/questions/17527713/force-browser-to-download-image-files-on-click
      this.myDownload.nativeElement.setAttribute('href', 'data:,');
      this.myDownload.nativeElement.setAttribute('download', 'img.svg');
    } else if (type === 'png') {
      this.myDownload.nativeElement.setAttribute('href', 'data:,');
      this.myDownload.nativeElement.setAttribute('download', 'img.png');
    }
  }

}
