import { Shape } from './shape';

describe('Shape', () => {

  let shape: Shape;

  beforeAll( () => { shape = new Shape(); } );

  it('should create an instance', () => {
    expect(new Shape()).toBeTruthy();
  });

  it('should be origin', () => {
    expect(shape.getOriginX()).toBe(0);
    expect(shape.getOriginY()).toBe(0);
  });

  it('shouldn\'t change coordinates', () => {
    shape.changeOrigin(-1, 1);
    expect(shape.getOriginX()).toBe(0);
    expect(shape.getOriginY()).toBe(0);
  });

  it('should change coordinates', () => {
    shape.changeOrigin(5, 10);
    expect(shape.getOriginX()).toBe(5);
    expect(shape.getOriginY()).toBe(10);
  });

});
