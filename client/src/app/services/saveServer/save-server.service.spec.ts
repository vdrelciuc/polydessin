import { TestBed } from '@angular/core/testing';

import { SaveServerService } from './save-server.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material';

describe('SaveServerService', () => {
  let service: SaveServerService;
  beforeEach(() => { 
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        
      ]
    });
    service = TestBed.get(SaveServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
