import { Coords } from './coordinates';

describe('Coords', () => {

  let point: Coords;

  beforeEach( () => { point = new Coords(10, 10); } );

  it('should create a Coords', () => {
    expect(new Coords(10, 10)).toBeTruthy();
  });

  it('should be able to access coordinates', () => {
    expect(point.x).toBe(10);
    expect(point.y).toBe(10);
  });

  it('should be able to change coordinates', () => {
    point.x = 1;
    point.y = 3;
    expect(point.x).toBe(1);
    expect(point.y).toBe(3);
  });

  it('#getQuadrant should return correct quadrant from the giving origin coords', () => {
    expect(point.getQuadrant(new Coords(5, 15))).toBe(1);
    expect(point.getQuadrant(new Coords(15, 15))).toBe(2);
    expect(point.getQuadrant(new Coords(15, 5))).toBe(3);
    expect(point.getQuadrant(new Coords(5, 5))).toBe(4);
  })

});
