import { Alignment } from '../enums/text-alignement';
import { CharacterFont } from '../enums/character-font';

export interface TextAttributes {
    alignment:  Alignment,
    font:       CharacterFont,
    isItalic:   boolean,
    isBold:     boolean,
    size:       number
}
