import { ShapeProperties } from './shape-properties';

describe('ShapeProperties', () => {

    let shape: ShapeProperties;

    beforeEach( () => { 
        shape = new ShapeProperties(); 
    });

    it('should create an instance', () => {
        expect(shape).toBeTruthy();
    });

    it('should have default fill color', () => {
        expect(shape.fillColor).toEqual('#e7e7e7');
    });

    it('should change fill color', () => {
        shape.changeColor('#e7e7e8');
        expect(shape.fillColor).toEqual('#e7e7e8');
    });

    it('should change fill color', () => {
        shape.changeThickness(10);
        expect(shape.thickness).toEqual(10);
    });

});
