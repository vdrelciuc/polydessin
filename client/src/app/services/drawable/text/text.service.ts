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
  }

  onClick(event: MouseEvent): void {
    this.clickPosition = CoordinatesXY.getEffectiveCoords(this.image, event);
    if (this.subElement !== undefined) {
      this.pushElement();
      this.textBoxes = new Map<number, SVGTextElement>();
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
      if (this.maxSize !== undefined && text.length > this.maxSize.size) {
        this.changeAlignment(this.properties.value.alignment);
      }
    }
  }

  changeAlignment(newAlignment: Alignment): void {
    this.findSizeOfLargestTextbox();
    switch (newAlignment) {
      case Alignment.Left: {
          this.toLeft();
          break;
      }
      case Alignment.Center: {
        this.toLeft();
        for (const textBox of this.textBoxes) {
          const text = textBox[1].innerHTML;
          let gap = this.maxSize.size - text.length;
          const before = Math.floor(gap / 2);
          textBox[1].innerHTML = ' '.repeat(before);
          gap -= before;
          textBox[1].innerHTML += text + ' '.repeat(gap);
          if (textBox[1] === this.currentTextbox) {
            textBox[1].innerHTML += ' ';
          }
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
    if (this.maxSize !== undefined && this.currentTextbox === this.maxSize.target) {
      this.changeAlignment(this.properties.value.alignment);
    }
  }

  backspace(): void {
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
    if (this.maxSize !== undefined && this.currentTextbox === this.maxSize.target) {
      this.changeAlignment(this.properties.value.alignment);
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

  moveRight(): void {
    const text = this.currentTextbox.innerHTML;
    const index = text.indexOf('|');
    if (index < text.length - 1) {
      this.currentTextbox.innerHTML = text.slice(0, index) + text[index + 1] + '|'  + text.slice(index + 2, text.length);
    } else {
      if (this.currentBoxNumber < this.textBoxes.size) {
        this.currentTextbox.innerHTML = text.substr(0, index);
        this.currentTextbox = this.textBoxes.get(this.currentBoxNumber ++) as SVGTextElement;
        this.currentTextbox.innerHTML =  '|' + this.currentTextbox.innerHTML;
      }
    }
  }

  createCurrentTextBox(): void {
    if (this.currentTextbox !== undefined) {
      const text = this.currentTextbox.innerHTML;
      this.currentTextbox.innerHTML = text.substr(0, text.length - 1);
    }
    this.currentTextbox = this.manipulator.createElement(SVGProperties.text, SVGProperties.nameSpace);
    this.manipulator.setAttribute(this.currentTextbox, SVGProperties.x,     this.clickPosition.getX().toString());
    this.manipulator.setAttribute(this.currentTextbox, SVGProperties.y,     this.clickPosition.getY().toString());
    this.currentTextbox.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
    this.currentTextbox.innerHTML = '|';
    this.updateStyle();
    this.manipulator.appendChild(this.subElement, this.currentTextbox);
    this.textBoxes.set(this.currentBoxNumber++, this.currentTextbox);
    this.clickPosition.setY(this.clickPosition.getY() + this.properties.value.size  * CONSTANTS.TEXT_SPACING);
  }

  private toLeft(): void {
    for (const textBox of this.textBoxes) {
      let text = textBox[1].innerHTML;
      while (text[0] === ' ') {
        text = text.substr(1);
      }
      textBox[1].innerHTML = text;
    }
  }

  private findSizeOfLargestTextbox(): void {
    this.maxSize = {
      target: (this.textBoxes.get(0) as SVGTextElement),
      size: (this.textBoxes.get(0) as SVGTextElement).innerHTML.length
    };
    let currentElementLength = 0;
    for (const textBox of this.textBoxes) {
      currentElementLength = textBox[1].innerHTML.length;
      if (currentElementLength > this.maxSize.size) {
        this.maxSize = {
          target: textBox[1],
          size: currentElementLength
        };
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
