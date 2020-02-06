import { Color } from './color';

describe('Color', () => {
    let color: Color;
    const defaultColor = '#000000';
    const defaultRGB = [0, 0, 0];

    beforeEach(() => {
        color = new Color();
    })

    it('should have default color if none is specified', () => {
        expect(color.getHex()).toEqual(defaultColor);
    });

    it('should change color to custom hex in constructor', () => {
        const customHex = '#FFFFFF';
        color = new Color(customHex);
        expect(color.getHex()).toEqual(customHex);
    });

    it('should change color to custom rgb in constructor', () => {
        const customRgb: number[] = [ 120, 130, 50 ];
        color = new Color(customRgb);
        expect(color.getRGB()).toEqual(customRgb);
    });

    it('should\'t set invalid hex of 9 chars without hash', () => {
        color.setHex('111111111');
        expect(color.getHex()).toEqual(defaultColor);
    });

    it('should\'t set invalid hex of 5 chars without hash', () => {
        color.setHex('11111');
        expect(color.getHex()).toEqual(defaultColor);
    });

    it('should set valid hex without hash', () => {
        const testHex = '111111';
        color.setHex(testHex);
        expect(color.getHex()).toEqual('#' + testHex);
    });

    it('should\'t set invalid hex of 9 chars with hash', () => {
        color.setHex('#11111111');
        expect(color.getHex()).toEqual(defaultColor);
    });

    it('should\'t set invalid hex of 5 chars with hash', () => {
        color.setHex('#1111');
        expect(color.getHex()).toEqual(defaultColor);
    });

    it('should set valid hex with hash', () => {
        const testHex = '#111111';
        color.setHex(testHex);
        expect(color.getHex()).toEqual(testHex);
    });

    it('shouldn\'t set hex with invalid letters', () => {
        const testHex = '#1ZZ111';
        color.setHex(testHex);
        expect(color.getHex()).toEqual(defaultColor);
    });

    it('should get default rbg', () => {
        expect(color.getRGB()).toEqual(defaultRGB);
    });

    it('shouldn\'t set rbg with invalid numbers', () => {
        color.setRGB([-10, 300, 10]);
        expect(color.getRGB()).toEqual([0, 255, 10]);
    });

    it('shouldn\'t set rbg with more numbers than required', () => {
        color.setRGB([100, 100, 10, 100]);
        expect(color.getRGB()).toEqual(defaultRGB);
    });
});
