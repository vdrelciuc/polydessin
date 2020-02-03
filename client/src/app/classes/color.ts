import * as CONSTANT from 'src/app/classes/constants';

export class Color {
    private static readonly MIN_VALUE: number = 0;
    private static readonly MAX_VALUE: number = 255;
    private static readonly BYTES_IN_HEX: number = 3;
    private readonly REGEX_WITH_HASHTAG: RegExp = /^#[0-9A-F]{6}$/i;
    private readonly REGEX_WITHOUT_HASHTAG: RegExp = /[0-9A-F]{6}$/i;
    // /^#[0-9A-F]{6}$/i.test('#AABBCC')

    private hex: string;

    constructor(color?: string | number[]) {
        if (typeof color === 'string') {
            this.setHex(color);
        } else if (color instanceof Array) {
            this.setRGB(color);
        } else {
            this.hex = CONSTANT.COLOR_DEFAULT;
        }
    }

    getHex(): string {
        return this.hex;
    }

    getRGB(): number[] {
        const red: string = this.hex.slice(1, 3);
        const green: string = this.hex.slice(3, 5);
        const blue: string = this.hex.slice(5);
        return [parseInt(red, CONSTANT.HEX_BASE), parseInt(green, CONSTANT.HEX_BASE), parseInt(blue, CONSTANT.HEX_BASE)];
    }

    setHex(hex: string): void {
        let padding = 0;
        if(hex.indexOf('#') !== -1) {
            padding =  1;
        }
        if(hex.length === (CONSTANT.HEX_LENGTH + padding)) {
            if (this.REGEX_WITH_HASHTAG.test(hex)) {
                this.hex = hex;
            } else if (this.REGEX_WITHOUT_HASHTAG.test(hex)) {
                this.hex = '#'.concat(hex);
            }
        }
    }

    setRGB(rgb: number[]): void {
        if (rgb.length === 3) {
            rgb[0] = Color.clamp(rgb[0]);
            rgb[1] = Color.clamp(rgb[1]);
            rgb[2] = Color.clamp(rgb[2]);

            this.hex = '#';
            for(let i = 0; i < Color.BYTES_IN_HEX; i++) {
                this.hex += Color.rgbToHex(rgb[i]);
            }
        }
    }

    private static rgbToHex(value: number): string { 
        let hex = Number(value).toString(CONSTANT.HEX_BASE);
        if (hex.length < 2) {
            hex = '0' + hex;
        }
        return hex;
      };

    private static clamp(value: number): number {
        return Math.min(Math.max(value, Color.MIN_VALUE), Color.MAX_VALUE);
    };
}
