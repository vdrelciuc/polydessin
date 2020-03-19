import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { GalleryService } from './gallery.service';

describe('GalleryService', () => {
  let service: GalleryService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.get(GalleryService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
