import { TestBed } from '@angular/core/testing';

import { BrushService } from './brush.service';

describe('BrushService', () => {

  let service: BrushService;

  beforeEach(() => {
    TestBed.configureTestingModule({

    });
    service = TestBed.get(BrushService)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

//   it('should have default size', () => {
//     expect(service.getcanvasSize(0)).toEqual(window.innerWidth - CreateNewService.toolBoxWidth);
//     expect(service.getcanvasSize(1)).toEqual(window.innerHeight);
//   });

//   it('should set canvas new width', () => {
//     service.setCanvasSize(0, 1);
//     expect(service.getcanvasSize(0)).toEqual(1);
//   });

//   it('shouldn\'t set canvas new negative width', () => {
//     service.setCanvasSize(0, 1);
//     service.setCanvasSize(0, -1);
//     expect(service.getcanvasSize(0)).toEqual(1);
//   });
// });
