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

    it('#setHex should\'t set invalid hex of 9 chars without hash', () => {
        color.setHex('111111111');
        expect(color.getHex()).toEqual(defaultColor);
    });

    it('#setHex should\'t set invalid hex of 5 chars without hash', () => {
        color.setHex('11111');
        expect(color.getHex()).toEqual(defaultColor);
    });

    it('#setHex should set valid hex without hash', () => {
        const testHex = '111111';
        color.setHex(testHex);
        expect(color.getHex()).toEqual('#' + testHex);
    });

    it('#setHex should\'t set invalid hex of 9 chars with hash', () => {
        color.setHex('#11111111');
        expect(color.getHex()).toEqual(defaultColor);
    });

    it('#setHex should\'t set invalid hex of 5 chars with hash', () => {
        color.setHex('#1111');
        expect(color.getHex()).toEqual(defaultColor);
    });

    it('#setHex should set valid hex with hash', () => {
        const testHex = '#111111';
        color.setHex(testHex);
        expect(color.getHex()).toEqual(testHex);
    });

    it('#setHex shouldn\'t set hex with invalid letters', () => {
        const testHex = '#1ZZ111';
        color.setHex(testHex);
        expect(color.getHex()).toEqual(defaultColor);
    });

    it('should get default rbg', () => {
        expect(color.getRGB()).toEqual(defaultRGB);
    });

    it('#setRGB shouldn\'t set rbg with invalid numbers', () => {
        color.setRGB([-10, 300, 10]);
        expect(color.getRGB()).toEqual([0, 255, 10]);
    });

    it('#setRGB shouldn\'t set rbg with more numbers than required', () => {
        color.setRGB([100, 100, 10, 100]);
        expect(color.getRGB()).toEqual(defaultRGB);
    });

    it('#getRedHex should get red part', () => {
        color.setRGB([15, 16, 17]); // #0f1011
        expect(color.getRedHex()).toEqual('0F');
    });

    it('#getGreenHex should get green part', () => {
        color.setRGB([15, 16, 17]); // #0f1011
        expect(color.getGreenHex()).toEqual('10');
    });

    it('#getBlueHex should get blue part', () => {
        color.setRGB([15, 16, 17]); // #0f1011
        expect(color.getBlueHex()).toEqual('11');
    });

    it('#setRedHex should set red part', () => {
        color.setRedHex('0f');
        expect(color.getRedHex()).toEqual('0F');
    });

    it('#setRedHex should set red part with empty parameter', () => {
        color.setRedHex('');
        expect(color.getRedHex()).toEqual('00');
    });

    it('#setRedHex should set red part with missing parameter', () => {
        color.setRedHex('F');
        expect(color.getRedHex()).toEqual('0F');
    });

    it('#setGreenHex should set green part', () => {
        color.setGreenHex('10');
        expect(color.getGreenHex()).toEqual('10');
    });

    it('#setGreenHex should set green part with empty parameter', () => {
        color.setGreenHex('');
        expect(color.getGreenHex()).toEqual('00');
    });

    it('#setGreenHex should set green part with missing parameter', () => {
        color.setGreenHex('F');
        expect(color.getGreenHex()).toEqual('0F');
    });

    it('#setBlueHex should set blue part', () => {
        color.setBlueHex('11');
        expect(color.getBlueHex()).toEqual('11');
    });

    it('#setBlueHex should set blue part with empty parameter', () => {
        color.setBlueHex('');
        expect(color.getBlueHex()).toEqual('00');
    });

    it('#setBlueHex should set blue part with missing parameter', () => {
        color.setBlueHex('F');
        expect(color.getBlueHex()).toEqual('0F');
    });
});
