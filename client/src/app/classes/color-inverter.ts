import { Color } from './color';

// Inspired from https://bit.ly/2H5a0UF, but heavily reajusted.

// If bw is true, the function will return the closest to black or white

export function invertColor(color: Color, bw: boolean): Color {
    const hex = color.getHex().slice(1);

    let red = parseInt(hex.slice(0, 2), 16);
    let green = parseInt(hex.slice(2, 4), 16);
    let blue = parseInt(hex.slice(4, 6), 16);

    if (bw) {
        // Factors from http://stackoverflow.com/a/3943023/112731
        const redConversionFactor = 0.299;
        const greenConversionFactor = 0.587;
        const blueConversionFactor = 0.114;
        const shadeLimit = 186;
        const blackOrWhite = (red * redConversionFactor + green * greenConversionFactor + blue * blueConversionFactor)
          > shadeLimit ? '#000000' : '#FFFFFF';

        return new Color(blackOrWhite);
    }

    // Invert color components
    red = 255 - red;
    green = 255 - green;
    blue = 255 - blue;

    return new Color([red, green, blue]);
}
