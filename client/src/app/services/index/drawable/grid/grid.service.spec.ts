import { TestBed } from '@angular/core/testing';

import { GridService } from './grid.service';
import * as CONSTANT from 'src/app/classes/constants';

describe('GridService', () => {

  let service: GridService;

  beforeEach(() => {
    TestBed.configureTestingModule({

    });
    service = TestBed.get(GridService);
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#toggle should change grid state', () => {
    service.toggle();
    expect(service.visible.value).not.toBeTruthy();
    service.toggle();
    expect(service.visible.value).toBeTruthy();
  });

  it('#incrementThickness should increment thickness', () => {
    service.incrementThickness();
    expect(service.thickness.value).toEqual(
      CONSTANT.GRID_MINIMUM + CONSTANT.THICKNESS_STEP
    );
  });

  it('#incrementThickness should NOT increment thickness', () => {
    service.thickness.next(CONSTANT.GRID_MAXIMUM);
    service.incrementThickness();
    expect(service.thickness.value).toEqual(
      CONSTANT.GRID_MAXIMUM
    );
  });

  it('#decrementThickness should not decrement thickness', () => {
    service.decrementThickness();
    expect(service.thickness.value).toEqual(
      CONSTANT.GRID_MINIMUM
    );
  });

  it('#decrementThickness should decrement thickness', () => {
    service.thickness.next(CONSTANT.GRID_MAXIMUM);
    service.decrementThickness();
    expect(service.thickness.value).toEqual(
      CONSTANT.GRID_MAXIMUM - CONSTANT.THICKNESS_STEP
    );
  });
});
