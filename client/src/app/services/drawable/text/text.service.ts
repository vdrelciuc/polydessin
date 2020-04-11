import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as CONSTANTS from 'src/app/classes/constants';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { CharacterFont } from 'src/app/enums/character-font';
import { CursorProperties } from 'src/app/enums/cursor-properties';
import { SVGProperties } from 'src/app/enums/svg-html-properties';
import { Alignment } from 'src/app/enums/text-alignement';
import { Max } from 'src/app/interfaces/max-text';
import { TextAttributes } from 'src/app/interfaces/text-attributes';
import { ColorSelectorService } from '../../color-selector/color-selector.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { DrawableService } from '../drawable.service';

@Injectable({
  providedIn: 'root'
})
export class TextService extends DrawableService {

  properties: BehaviorSubject<TextAttributes>;
  private textBoxes: Map<number, SVGTextElement>;
  private currentTextbox: SVGTextElement;
  private currentBoxNumber: number;
  private clickPosition: CoordinatesXY;
  private toByPass: Set<string>;
  private maxSize: Max;

  constructor() {
    super();
    this.frenchName = 'Texte';
    this.properties = new BehaviorSubject<TextAttributes>({
      alignment: Alignment.Left,
      font: CharacterFont.C,
      isItalic: false,
      isBold: false,
      size: CONSTANTS.DEFAULT_TEXT_SIZE
    });
    this.textBoxes = new Map<number, SVGTextElement>();
    this.toByPass = CONSTANTS.KEYS_TO_BYPASS;
    this.currentBoxNumber = 0;
    this.maxSize = {
      target: undefined as unknown as SVGTextElement,
      size: 0
    };
  }

  initialize(
    manipulator: Renderer2,
    image: ElementRef<SVGElement>,
    colorSelectorService: ColorSelectorService,
    drawStack: DrawStackService): void {
      this.assignParams(manipulator, image, colorSelectorService, drawStack);
      this.colorSelectorService.primaryColor.subscribe( () => this.updateStyle() );
      this.properties.subscribe( () => this.textBoxes.forEach( (textBox) => this.updateStyle(textBox)));
  }

  onSelect(): void {
    this.manipulator.setAttribute(this.image.nativeElement, CursorProperties.cursor, CursorProperties.writing);
    if (this.currentTextbox !== undefined) {
      const text = this.currentTextbox.innerHTML;
      const index = text.indexOf('|');
      this.currentTextbox.innerHTML = text.slice(0, index) + '|' + text.slice(index, text.length);
      this.moveRight();
      this.changeAlignment(this.properties.value.alignment);
    }
  }

  endTool(): void {
    if (this.currentTextbox !== undefined) {
      const text = this.currentTextbox.innerHTML;
      const index = text.indexOf('|');
      this.currentTextbox.innerHTML = text.slice(0, index) + text.slice(index + 1, text.length);
    }
    if (this.subElement !== undefined) {
      this.pushElement();
    }
    this.manipulator.setAttribute(this.image.nativeElement, CursorProperties.cursor, CursorProperties.default);
    this.currentBoxNumber = 0;
  }

  onClick(event: MouseEvent): void {
    this.clickPosition = CoordinatesXY.getEffectiveCoords(this.image, event);
    if (this.subElement !== undefined) {
      this.pushElement();
      this.textBoxes = new Map<number, SVGTextElement>();
      this.currentBoxNumber = 0;
      while (!this.moveRight());
    }
    this.createElement();
  }

  onKeyPressed(event: KeyboardEvent): void {
    if (this.toByPass.has(event.key)) {
      return ;
    }
    if (this.currentTextbox !== undefined) {
      const text = this.currentTextbox.innerHTML;
      const index = text.indexOf('|');
      this.currentTextbox.innerHTML = text.slice(0, index) + event.key + text.slice(index, text.length);
      this.changeAlignment(this.properties.value.alignment);
    }
  }

  changeAlignment(newAlignment: Alignment): void {
    this.findSizeOfLargestTextbox();
    this.toLeft();
    switch (newAlignment) {
      case Alignment.Center: {
        this.toLeft();
        for (const textBox of this.textBoxes) {
          const text = textBox[1].innerHTML.trim();
          let gap = this.maxSize.size - text.length;
          const before = Math.floor(gap / 2);
          textBox[1].innerHTML = ' '.repeat(before) + text;
        }
        break;
      }
      case Alignment.Right: {
        this.toLeft();
        for (const textBox of this.textBoxes) {
          const text = textBox[1].innerHTML;
          textBox[1].innerHTML = ' '.repeat(this.maxSize.size - text.length);
          if (textBox[1] === this.currentTextbox) {
            textBox[1].innerHTML += ' ';
          }
          textBox[1].innerHTML += text;
        }
        break;
      }
      default:
        break;
    }
  }

  cancel(): void {
    for (const box of this.textBoxes) {
      box[1].remove();
      this.subElement.remove();
      this.textBoxes.delete(box[0]);
    }
    this.textBoxes.clear();
  }

  delete(): void {
    const text = this.currentTextbox.innerHTML;
    const index = text.indexOf('|');
    if (index !== text.length - 1) {
      this.currentTextbox.innerHTML = text.slice(0, index + 1) + text.slice(index + 2, text.length);
    }
    //if (this.maxSize !== undefined && this.currentTextbox === this.maxSize.target) {
      this.changeAlignment(this.properties.value.alignment);
    //}
  }

  backspace(): void {
    if (this.currentTextbox !== undefined) {
      const oldAlign = this.properties.value.alignment;
      this.changeAlignment(Alignment.Left);
      const text = this.currentTextbox.innerHTML;
      const index = text.indexOf('|');
      if (index > 0) {
        this.currentTextbox.innerHTML = text.slice(0, index - 1) + text.slice(index, text.length);
      } else {
        this.currentTextbox.remove();
        this.textBoxes.delete(--this.currentBoxNumber);
        this.clickPosition.setY(this.clickPosition.getY() - this.properties.value.size  * CONSTANTS.TEXT_SPACING);
        if (this.currentBoxNumber === 0) {
          this.createCurrentTextBox();
        } else {
          this.currentTextbox = this.textBoxes.get(this.currentBoxNumber - 1) as SVGTextElement;
          this.currentTextbox.innerHTML += text;
        }
      }
      this.changeAlignment(oldAlign);
    }
  }

  moveLeft(): void {
    const text = this.currentTextbox.innerHTML;
    const index = text.indexOf('|');
    if (index > 0) {
      this.currentTextbox.innerHTML = text.slice(0, index - 1) + '|' + text[index - 1] + text.slice(index + 1, text.length);
    } else {
        if (this.currentBoxNumber !== 1) {
          this.currentTextbox.innerHTML = text.substr(1);
          this.currentTextbox = this.textBoxes.get((--this.currentBoxNumber) - 1) as SVGTextElement;
          this.currentTextbox.innerHTML +=  '|';
        }
    }
  }

  moveRight(): boolean {
    const text = this.currentTextbox.innerHTML;
    const index = text.indexOf('|');
    if (index < text.length - 1) {
      this.currentTextbox.innerHTML = text.slice(0, index) + text[index + 1] + '|'  + text.slice(index + 2, text.length);
      return false;
    } else if (this.currentBoxNumber < this.textBoxes.size) {
      this.currentTextbox.innerHTML = text.substr(0, index);
      this.currentTextbox = this.textBoxes.get(this.currentBoxNumber ++) as SVGTextElement;
      this.currentTextbox.innerHTML =  '|' + this.currentTextbox.innerHTML;
      return false;
    }
    return true; // At the end of all text boxes
  }

  createCurrentTextBox(): void {
    let restText = '';
    if (this.currentTextbox !== undefined) {
      const text = this.currentTextbox.innerHTML;
      const cursor = text.indexOf('|');
      this.currentTextbox.innerHTML = text.substr(0, cursor);
      restText = text.substr(cursor);
    }
    this.currentTextbox = this.manipulator.createElement(SVGProperties.text, SVGProperties.nameSpace);
    this.manipulator.setAttribute(this.currentTextbox, SVGProperties.x,     this.clickPosition.getX().toString());
    this.manipulator.setAttribute(this.currentTextbox, SVGProperties.y,     this.clickPosition.getY().toString());
    this.currentTextbox.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
    this.currentTextbox.innerHTML = restText === '' ? '|' : restText;
    this.updateStyle();
    this.manipulator.appendChild(this.subElement, this.currentTextbox);
    this.textBoxes.set(this.currentBoxNumber++, this.currentTextbox);
    if (this.currentBoxNumber > 1) {
      this.changeAlignment(this.properties.value.alignment);
    }
    this.clickPosition.setY(this.clickPosition.getY() + this.properties.value.size  * CONSTANTS.TEXT_SPACING);
  }

  private toLeft(): void {
    for (const textBox of this.textBoxes) {
      let text = textBox[1].innerHTML;
      while(text[0] === ' ') {
        text = text.substr(1);
      }
      textBox[1].innerHTML = text;
    }
  }

  private findSizeOfLargestTextbox(): void {
    let currentElementLength = 0;
    for (const textBox of this.textBoxes) {
      currentElementLength = textBox[1].innerHTML.trim().length;
      if (currentElementLength > this.maxSize.size) {
        this.maxSize.target = textBox[1];
        this.maxSize.size = (currentElementLength);
      }
    }
  }

  private createElement(): void {
    this.subElement = this.manipulator.createElement(SVGProperties.g, SVGProperties.nameSpace);
    this.createCurrentTextBox();
    this.manipulator.appendChild(this.image.nativeElement, this.subElement);
  }

  private updateStyle(toUpdate: SVGTextElement = this.currentTextbox): void {
    if (this.currentTextbox !== undefined) {
      this.manipulator.setAttribute(toUpdate, SVGProperties.fontSize, this.properties.value.size.toString());
      this.manipulator.setAttribute(toUpdate, SVGProperties.font, this.properties.value.font.toString());
      this.manipulator.setAttribute(toUpdate, SVGProperties.fill,
        this.colorSelectorService.primaryColor.value.getHex()
      );
      if (this.properties.value.isItalic) {
        this.manipulator.setAttribute(toUpdate, SVGProperties.fontStyle, 'italic');
      } else {
        this.manipulator.setAttribute(toUpdate, SVGProperties.fontStyle, ' ');
      }
      if (this.properties.value.isBold) {
        this.manipulator.setAttribute(toUpdate, SVGProperties.fontWeight, 'bold');
      } else {
        this.manipulator.setAttribute(toUpdate, SVGProperties.fontWeight, ' ');
      }
    }
  }
}
