import { TestBed } from '@angular/core/testing';

import { GalleryService } from './gallery.service';
import { HttpClientModule } from '@angular/common/http';

describe('GalleryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ]
    });
    
  });
  

  it('should be created', () => {
    const service: GalleryService = TestBed.get(GalleryService);
    expect(service).toBeTruthy();
  });
});
