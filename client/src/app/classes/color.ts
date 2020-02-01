import * as CONSTANT from 'src/app/classes/constants';

export class Color {
    private readonly MIN_VALUE = 0;
    private readonly MAX_VALUE = 255;
    private readonly REGEX_WITH_HASHTAG = /^#([0-9A-F]{3}){1,2}$/i;
    private readonly REGEX_WITHOUT_HASHTAG = /([0-9A-F]{3}){1,2}$/i;

    private hex: string;

    constructor(color?: string | number[]) {
        if (color === undefined) {
            this.hex = CONSTANT.COLOR_DEFAULT;
        } else if (typeof color === "string") {
            this.setHex(color);
        } else {
            this.setRGB(color);
        }
    }

    getHex(): string {
        return this.hex;
    }

    getRGB(): number[] {
        return [parseInt(this.hex.slice(1,2)), parseInt(this.hex.slice(3,4)), parseInt(this.hex.slice(5,6))];
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

            this.hex = '#'.concat(rgb[0].toString()).concat(rgb[1].toString()).concat(rgb[2].toString());
        }
    }

    private clamp(value: number): number {
        return Math.min(Math.max(value, this.MIN_VALUE), this.MAX_VALUE);
    };
}