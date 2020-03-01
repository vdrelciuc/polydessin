import {ElementRef, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  private image: ElementRef<SVGElement>;
  canvas: HTMLCanvasElement;
  myDownload: ElementRef;
  imageString : string;
  doneLoading : boolean;
  initialize(image: ElementRef<SVGElement>): void {
    this.image = image;
  }

   total(){
    this.svgToCanvas('png');
    this.downloadCorrectType('png','')
  }

  // formula of conversion from https://spin.atomicobject.com/2014/01/21/convert-svg-to-png/
  async svgToCanvas(type : string) {
    let img = new Image();
    var xml = new XMLSerializer().serializeToString(this.image.nativeElement);
    var svg64 = btoa(xml);
    var b64Start = 'data:image/svg+xml;base64,';
    var image64 = b64Start + svg64;

    img.src = image64;
    img.onload =  ()=> {
      this.canvas.width = img.width;
      this.canvas.height = img.height;
      var context = this.canvas.getContext('2d');
      if (context !==null){
        // saturate(0.3)'
        //'invert(0.5)'
        //'sepia(1)'
        //'grayscale(0.5)'
        //'contrast(0.4)'
        //''
        context.filter = '';
        context.drawImage(img, 0, 0);
        if (type === 'jpg' ){
          this.imageString = this.canvas.toDataURL('image/jpeg');
        }else if (type === 'png'){
          this.imageString = this.canvas.toDataURL('image/png');
        } else if (type === 'svg') {

        }
        this.doneLoading = true;
        this.downloadCorrectType('png',this.imageString);
      }
    };


  }



  downloadCorrectType(type: string, src: string) {
    console.log(this.imageString);
    // theory from https://stackoverflow.com/questions/17527713/force-browser-to-download-image-files-on-click
    this.myDownload.nativeElement.setAttribute('href', this.imageString);
    let finalString = 'img.' + type;
    this.myDownload.nativeElement.setAttribute('download', finalString);
    this.doneLoading = false;
  }

}
