import { Color } from './color';
import { invertColor } from './color-inverter';

describe('Color', () => {

    it('#invertColor should return black if color is light and bw is true', () => {
        const lightYellow = new Color('#EEDD82');
        const closestShade = invertColor(lightYellow, true);
        expect(closestShade.getHex()).toBe('#000000');
    });

    it('#invertColor should return white if color is dark and bw is true', () => {
        const darkBrown = new Color('#2f2c1a'); // dark brown
        const closestShade = invertColor(darkBrown, true);
        expect(closestShade.getHex()).toBe('#ffffff');
    });

    it('#invertColor should return opposite color when bw is false', () => {
        const white = new Color('#ffffff');
        const black = new Color('#000000')
        expect(invertColor(white, false).getHex()).toBe('#000000');
        expect(invertColor(black, false).getHex()).toBe('#ffffff');
    });

});
