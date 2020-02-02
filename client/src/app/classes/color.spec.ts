import { Color } from './color';

describe('Color', () => {

    let color: Color;

    it('should have default color if none is specified', () => {
        color = new Color();
        const defaultColor = '#000000';
        expect(color.getHex()).toBe(defaultColor);
    });

    it('should change color to custom hex in constructor', () => {
        const customHex = '#FFFFFF';
        color = new Color(customHex);
        expect(color.getHex()).toBe(customHex);
    });

    it('should change color to custom rgb in constructor', () => {
        const customRgb: number[] = [ 120, 130, 50 ];
        color = new Color(customRgb);
        expect(color.getRGB()).toEqual(customRgb);
    });

});
