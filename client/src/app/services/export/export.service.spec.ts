import { TestBed } from '@angular/core/testing';

import { ImageFilter } from 'src/app/enums/color-filter';
import { ImageFormat } from 'src/app/enums/image-format';
import { ExportService } from './export.service';

describe('ExportService', () => {
  let service: ExportService;
  const mockedElement = {
    id: '100',
    setAttribute: () => null,
    cloneNode: () => mockedElement as unknown as Node,
  } as unknown as SVGElement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ExportService);
    service['image'] = {
      nativeElement: {
        id: '100',
        setAttribute: () => null,
        cloneNode: () => mockedElement,
      } as unknown as SVGElement
    };

    service['myDownload'] = {
      nativeElement: {
        id: '100',
        setAttribute: () => null,
        cloneNode: () => mockedElement,
      } as unknown as SVGElement
    };

    service['originalCanvas'] = {
      filter: null,
      width: 100,
      height: 100,
      toDataURL: () => 'url',
      drawImage: () => null,
      getContext: () => ({
        filter: '',
        drawImage: () => null
      } as unknown as CanvasRenderingContext2D)
    } as unknown as HTMLCanvasElement;

    service['canvas'] = {
      filter: null,
      toDataURL: () => 'url',
      drawImage: () => null,
      getContext: () => ({
        clearRect: () => null,
        filter: '',
        drawImage: () => null,
        scale: () => null,
        canvas: {
          width: 100,
          height: 100,
        }
      } as unknown as CanvasRenderingContext2D)
    } as unknown as HTMLCanvasElement;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#initialize should init reference image', () => {
    const mockedElementRef = { nativeElement: mockedElement };
    expect(service['image'].nativeElement.id).toEqual('100');
    service.initialize(mockedElementRef);
    expect(service['image']).toEqual(mockedElementRef);
  });

  it('#validateTitle should set valid title', () => {
    service.validateTitle('test1');
    expect(service['isTitleValid'].value).toEqual(true);
  });

  it('#validateTitle should not set invalid title', () => {
    service.validateTitle('1');
    expect(service['isTitleValid'].value).toEqual(false);
  });

  it('#export should export svg with filter', () => {
    const spy = spyOn(service['myDownload'].nativeElement, 'setAttribute');
    service['currentFormat'].next(ImageFormat.SVG);
    service['currentFilter'].next(ImageFilter.Négatif);
    const spy2 = spyOn(service['serialized'], 'serializeToString').and.callFake(() => {
      return 'string';
    });
    service.export('title');
    expect(spy.calls.allArgs()).toEqual([
      [ 'href', 'data:image/svg+xml;base64,' + btoa('string')],
      [ 'download', 'title.svg' ]
    ]);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy2).toHaveBeenCalled();
  });

  it('#export should export jpeg without filter', () => {
    service['currentFormat'].next(ImageFormat.JPEG);
    service['currentFilter'].next(undefined as unknown as ImageFilter);
    const spy = spyOn(service['originalCanvas'], 'getContext');
    const spy2 = spyOn(service['myDownload'].nativeElement, 'setAttribute');
    spyOn(service['originalCanvas'], 'toDataURL').and.callFake( () => {
      return 'data';
    });
    service['imageAfterDeserialization'] = {
      src: '1',
    } as unknown as HTMLImageElement;
    service.export('title');
    expect(spy).toHaveBeenCalled();
    expect(service['imageAfterDeserialization'].src).toEqual('data');
    expect(spy2.calls.allArgs()).toEqual([
      [ 'href', 'data'],
      [ 'download', 'title.JPEG' ]
    ]);
    expect(spy2).toHaveBeenCalledTimes(2);
  });

  it('#drawPreview should preview element on firstCall', () => {
    service['currentFilter'].next(ImageFilter.Négatif);
    service.drawPreview(true);
  });
});
