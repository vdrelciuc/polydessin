import * as CONSTANT from 'src/app/classes/constants';

export class Color {

  private static readonly MIN_VALUE: number = 0;
  private static readonly MAX_VALUE: number = 255;
  private static readonly BYTES_IN_HEX: number = 3;
  private readonly REGEX_WITH_HASHTAG: RegExp = /^#[0-9A-F]{6}$/i;
  private readonly REGEX_WITHOUT_HASHTAG: RegExp = /[0-9A-F]{6}$/i;
  private readonly REGEX_RGB_VALUE_IN_HEX: RegExp = /[0-9A-F]{2}$/i;

  private hex: string;

  constructor(color?: string | number[]) {
      if (typeof color === 'string') {
          this.setHex(color);
      } else if (color instanceof Array) {
          this.setRGB(color);
      } else {
          this.hex = CONSTANT.DEFAULT_PRIMARY_COLOR;
      }
  }

  static areVisuallyEqualForRed(color1: Color, color2: Color): boolean {
    const redOfColor1HSL = color1.getRGB()[0] / 255;
    const redOfColor2HSL = color2.getRGB()[0] / 255;
    const difference = (redOfColor1HSL - redOfColor2HSL) * 100;
    return difference < 15 && difference > -15;
  }

  private static rgbToHex(value: number): string {
      let hex = Number(value).toString(CONSTANT.HEX_BASE);
      if (hex.length < 2) {
          hex = '0' + hex;
      }
      hex = hex.toUpperCase();
      return hex;
    }
  private static clamp(value: number): number {
      return Math.min(Math.max(value, Color.MIN_VALUE), Color.MAX_VALUE);
  }
  getHex(): string {
      return this.hex;
  }

  getRGB(): number[] {
      const red: string = this.getRedHex();
      const green: string = this.getGreenHex();
      const blue: string = this.getBlueHex();
      return [parseInt(red, CONSTANT.HEX_BASE), parseInt(green, CONSTANT.HEX_BASE), parseInt(blue, CONSTANT.HEX_BASE)];
  }

  setHex(hex: string): void {
      let padding = 0;
      if (hex.indexOf('#') !== -1) {
          padding =  1;
      }
      if (hex.length === (CONSTANT.HEX_LENGTH + padding)) {
          if (this.REGEX_WITH_HASHTAG.test(hex)) {
              this.hex = hex.toUpperCase();
          } else if (this.REGEX_WITHOUT_HASHTAG.test(hex)) {
              this.hex = '#'.concat(hex).toUpperCase();
          }
      }
  }

  setRGB(rgb: number[]): void {
      if (rgb.length === 3) {
          rgb[0] = Color.clamp(rgb[0]);
          rgb[1] = Color.clamp(rgb[1]);
          rgb[2] = Color.clamp(rgb[2]);

          this.hex = '#';
          for (let i = 0; i < Color.BYTES_IN_HEX; i++) {
              this.hex += Color.rgbToHex(rgb[i]);
          }
      }
  }

  getRedHex(): string {
    return this.hex.slice(1, 3).toUpperCase();
  }

  getGreenHex(): string {
    return this.hex.slice(3, 5).toUpperCase();
  }

  getBlueHex(): string {
    return this.hex.slice(5).toUpperCase();
  }

  setRedHex(red: string): void {
    red = this.correctHexDigit(red);
    if (this.REGEX_RGB_VALUE_IN_HEX.test(red)) {
      this.hex = this.hex.charAt(0) + red + this.hex.substr(3);
    }
  }

  setGreenHex(green: string): void {
    green = this.correctHexDigit(green);
    if (this.REGEX_RGB_VALUE_IN_HEX.test(green)) {
      this.hex = this.hex.substr(0, 3) + green + this.hex.substr(5);
    }
  }

  setBlueHex(blue: string): void {
    blue = this.correctHexDigit(blue);
    if (this.REGEX_RGB_VALUE_IN_HEX.test(blue)) {
      this.hex = this.hex.substr(0, 5) + blue;
    }
  }

  private correctHexDigit(n: string): string {
    if (n.length === 0) {
      return '00';
    } else if (n.length === 1) {
      return '0' + n;
    } else {
      return n;
    }
  }

  // Inspired from https://bit.ly/2UBCNIs, but heavily reajusted.

  // If bw is true, the function will return the closest to black or white
  // (pale colors will return black and dark colors will return white)

  getInvertedColor(bw: boolean): Color {
    const hex = this.getHex().slice(1);

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
}
