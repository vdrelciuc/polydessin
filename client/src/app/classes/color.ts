import * as CONSTANT from 'src/app/classes/constants';

export class Color {
    private readonly MIN_VALUE: number = 0;
    private readonly MAX_VALUE: number = 255;
    private readonly REGEX_WITH_HASHTAG: RegExp = /^#([0-9A-F]{3}){1,2}$/i;
    private readonly REGEX_WITHOUT_HASHTAG: RegExp = /([0-9A-F]{3}){1,2}$/i;

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
        if (this.REGEX_WITH_HASHTAG.test(hex)) {
            this.hex = hex;
        } else if (this.REGEX_WITHOUT_HASHTAG.test(hex)) {
            this.hex = '#'.concat(hex);
        }
    }

    setRGB(rgb: number[]): void {
        if (rgb.length === 3) {
            rgb[0] = this.clamp(rgb[0]);
            rgb[1] = this.clamp(rgb[1]);
            rgb[2] = this.clamp(rgb[2]);

            this.hex = '#'.concat(rgb[0].toString(16)).concat(rgb[1].toString(16)).concat(rgb[2].toString(16));
        }
    }

    private clamp(value: number): number {
        return Math.min(Math.max(value, this.MIN_VALUE), this.MAX_VALUE);
    };
}
