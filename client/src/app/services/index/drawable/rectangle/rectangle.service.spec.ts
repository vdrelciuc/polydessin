import { TestBed } from '@angular/core/testing';

import { RectangleService } from './rectangle.service';

describe('RectangleService', () => {

  let rectangleService: RectangleService;

  //beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => { rectangleService = new RectangleService() });

  it('should be created', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    expect(service).toBeTruthy();
  });

  it('should set the RectangleService with its correct default attributes', () => {
    expect(rectangleService.frenchName).toBe("Rectangle");
    expect(rectangleService.shapeStyle).toBeTruthy();
  })

});
