import { CoordinatesXY } from './coordinates-x-y';

describe('CoordinatedXY', () => {

  let point: CoordinatesXY;

  beforeEach( () => { point = new CoordinatesXY(0, 0); } );

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

  it('#getQuadrant should return correct quadrant from the giving origin coordinates', () => {
    expect(point.getQuadrant(new CoordinatesXY(5, 15))).toBe(1);
    expect(point.getQuadrant(new CoordinatesXY(15, 15))).toBe(2);
    expect(point.getQuadrant(new CoordinatesXY(15, 5))).toBe(3);
    expect(point.getQuadrant(new CoordinatesXY(5, 5))).toBe(4);
  })

});
