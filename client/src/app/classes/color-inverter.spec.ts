// import { invertColor } from './color-inverter';
// import { Color } from './color';

// describe('Color', () => {

//     it('#invertColor should return black if color is light and bw is true', () => {
//         let lightYellow = new Color('#EEDD82');
//         let closestShade = invertColor(lightYellow, true);
//         expect(closestShade.getHex()).toBe('#000000');
//     });

//     it('#invertColor should return white if color is dark and bw is true', () => {
//         let darkBrown = new Color('#2e2d25'); // dark brown
//         let closestShade = invertColor(darkBrown, true);
//         expect(closestShade.getHex()).toBe('#FFFFFF');
//     });

//     it('#invertColor should return opposite color when bw is false', () => {
//         let white = new Color('#ffffff');
//         let black = new Color('#000000')
//         expect(invertColor(white, false).getHex()).toBe('#000000');
//         expect(invertColor(black, false).getHex()).toBe('#ffffff');
//     });

// });
