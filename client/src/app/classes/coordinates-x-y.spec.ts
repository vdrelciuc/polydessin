import { CoordinatesXY } from './coordinates-x-y';

describe('CoordinatedXY', () => {

  let point: CoordinatesXY;

  beforeEach( () => { point = new CoordinatesXY(0,0); } );

  it('should create an instance', () => {
    expect(new CoordinatesXY(0, 0)).toBeTruthy();
  });

  it('should get coordinates', () => {
    expect(point.getX()).toBe(0);
    expect(point.getY()).toBe(0);
  });

  it('should not change coordinates', () => {
    point.setX(-1);
    point.setY(-1);
    expect(point.getX()).toBe(0);
    expect(point.getY()).toBe(0);
  });

  it('should change coordinates', () => {
    point.setX(1);
    point.setY(1);
    expect(point.getX()).toBe(1);
    expect(point.getY()).toBe(1);
  });



});
