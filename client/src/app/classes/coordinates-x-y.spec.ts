import { CoordinatesXY } from './coordinates-x-y';

describe('CoordinatedXY', () => {

  let point: CoordinatesXY;

  beforeEach( () => { point = new CoordinatesXY(0, 0); } );

  it('should create an instance', () => {
    expect(new CoordinatesXY(0, 0)).toBeTruthy();
  });

  it('#getX should get coordinates', () => {
    expect(point.getX()).toBe(0);
    expect(point.getY()).toBe(0);
  });

  it('#setX should not change coordinates', () => {
    point.setX(-1);
    point.setY(-1);
    expect(point.getX()).toBe(0);
    expect(point.getY()).toBe(0);
  });

  it('#setX should change coordinates', () => {
    point.setX(1);
    point.setY(1);
    expect(point.getX()).toBe(1);
    expect(point.getY()).toBe(1);
  });

  it('#getClosestPoint should get the same point', () => {
    const closest = point.getClosestPoint(100, 100);
    expect(closest).toEqual(new CoordinatesXY(100, 100));
  });

  it('#getClosestPoint should get on a 45degree angle point', () => {
    const closest = point.getClosestPoint(100, 90);
    expect(closest).toEqual(new CoordinatesXY(100, 100));
  });

  it('#getClosestPoint should get on a 45degree angle point negativ', () => {
    const closest = point.getClosestPoint(-100, 90);
    expect(closest).toEqual(new CoordinatesXY(-100, 100));
  });

  it('#getQuadrant should return correct quadrant from the giving origin coordinates', () => {
    expect(point.getQuadrant(new CoordinatesXY(5, 15))).toBe(1);
    expect(point.getQuadrant(new CoordinatesXY(15, 15))).toBe(2);
    expect(point.getQuadrant(new CoordinatesXY(15, 5))).toBe(3);
    expect(point.getQuadrant(new CoordinatesXY(5, 5))).toBe(4);
  })

  it('#getClosestPoint should get on a 45degree angle point', () => {
    const closest = point.getClosestPoint(-100, 90);
    expect(closest).toEqual(new CoordinatesXY(-100, 100));
  });

  it('#getClosestPoint should get on a 0degree angle point', () => {
    const closest = point.getClosestPoint(100, 5);
    expect(closest).toEqual(new CoordinatesXY(100, 0));
  });

  it('#getClosestPoint should get on a 90degree angle point', () => {
    const closest = point.getClosestPoint(5, 100);
    expect(closest).toEqual(new CoordinatesXY(0, 100));
  });

  it('#getClosestPoint should get on a 90degree angle point in 3rd quadrant', () => {
    const closest = point.getClosestPoint(-100, -100);
    expect(closest).toEqual(new CoordinatesXY(-100, -100));
  });

  it('#getClosestPoint should get on a 90degree angle point in 4th quadrant', () => {
    const closest = point.getClosestPoint(100, -100);
    expect(closest).toEqual(new CoordinatesXY(100, -100));
  });
});
