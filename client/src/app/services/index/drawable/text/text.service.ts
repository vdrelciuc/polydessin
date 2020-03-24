import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { DrawableService } from '../drawable.service';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import { BehaviorSubject } from 'rxjs';
import * as CONSTANTS from 'src/app/classes/constants';
import { Alignment } from 'src/app/enums/text-alignement';
import { CharacterFont } from 'src/app/enums/character-font';
import { CursorProperties } from 'src/app/classes/cursor-properties';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';

@Injectable({
  providedIn: 'root'
})
export class TextService extends DrawableService{

  size: BehaviorSubject<number>;
  alignment: BehaviorSubject<Alignment>;
  font: BehaviorSubject<string>;
  isItalic: BehaviorSubject<boolean>;
  isBold: BehaviorSubject<boolean>;
  private textBoxes: Map<number, SVGTextElement>;
  private currentTextbox: SVGTextElement;
  private currentBoxNumber: number;
  private clickPosition: CoordinatesXY;
  private toByPass: Set<string>;

  constructor() {
    super();
    this.size = new BehaviorSubject<number>(CONSTANTS.DEFAULT_TEXT_SIZE);
    this.alignment = new BehaviorSubject<Alignment>(Alignment.Left);
    this.font = new BehaviorSubject<string>(CharacterFont.Ubuntu);
    this.isItalic = new BehaviorSubject<boolean>(false);
    this.isBold = new BehaviorSubject<boolean>(false);
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
      this.size.subscribe( () => this.updateStyle() );
      this.alignment.subscribe( () => this.updateStyle() );
      this.font.subscribe( () => this.updateStyle() );
      this.isItalic.subscribe( () => this.updateStyle() );
      this.isBold.subscribe( () => this.updateStyle() );
  }

  onSelect(): void {
    this.manipulator.setAttribute(this.image.nativeElement, CursorProperties.cursor, CursorProperties.writing);
  }

  endTool(): void {
    if(this.subElement !== undefined) {
      this.pushElement();
    }
    this.manipulator.setAttribute(this.image.nativeElement, CursorProperties.cursor, CursorProperties.default);
  }

  onClick(event: MouseEvent): void {
    this.clickPosition = CoordinatesXY.getEffectiveCoords(this.image, event);
    if(this.subElement !== undefined) {
      this.pushElement();
    }
    this.createElement();
  
  }

  onKeyPressed(event: KeyboardEvent): void {
    if(this.toByPass.has(event.key)) {
      return ;
    }
    if(this.currentTextbox !== undefined) {
      const text = this.currentTextbox.innerHTML;
      // this.currentTextbox.innerHTML = text.replace('|', event.key) + '|'; 
      const index = text.indexOf('|');
      this.currentTextbox.innerHTML = text.slice(0, index) + event.key + text.slice(index, text.length);
    }
  }

  cancel(): void {
    for(const box of this.textBoxes) {
      box[1].remove();
      this.subElement.remove();
    }
  }

  delete(): void {
    const text = this.currentTextbox.innerHTML;
    const index = text.indexOf('|');
    if(index !== text.length - 1) {
      this.currentTextbox.innerHTML = text.slice(0, index + 1) + text.slice(index + 2, text.length);
    }
  }

  backspace(): void {
    const text = this.currentTextbox.innerHTML;
    const index = text.indexOf('|');
    if(index > 0) {
      this.currentTextbox.innerHTML = text.slice(0, index - 1) + text.slice(index, text.length);
    } else {
      this.currentTextbox.remove();
      this.textBoxes.delete(--this.currentBoxNumber);
      this.clickPosition.setY(this.clickPosition.getY() - this.size.value  * CONSTANTS.TEXT_SPACING);
      if(this.currentBoxNumber === 0) {
        this.createCurrentTextBox();
      } else {
        this.currentTextbox = this.textBoxes.get(this.currentBoxNumber - 1) as SVGTextElement;
        this.currentTextbox.innerHTML += text;
      }
    }
  }

  moveLeft(): void {
    const text = this.currentTextbox.innerHTML;
    const index = text.indexOf('|');
    if(index > 0) {
      this.currentTextbox.innerHTML = text.slice(0, index - 1) + '|' + text[index - 1] + text.slice(index + 1, text.length);
    }
  }

  moveRight(): void {
    const text = this.currentTextbox.innerHTML;
    const index = text.indexOf('|');
    if(index < text.length - 1) {
      this.currentTextbox.innerHTML = text.slice(0, index) + text[index + 1] + '|'  + text.slice(index + 2, text.length);
    }
  }

  createCurrentTextBox(): void {
    if(this.currentTextbox !== undefined) {
      const text = this.currentTextbox.innerHTML;
      this.currentTextbox.innerHTML = text.substr(0, text.length - 1);
    }
    this.currentTextbox = this.manipulator.createElement(SVGProperties.text, SVGProperties.nameSpace);
    this.manipulator.setAttribute(this.currentTextbox, SVGProperties.x,     this.clickPosition.getX().toString());
    this.manipulator.setAttribute(this.currentTextbox, SVGProperties.y,     this.clickPosition.getY().toString());
    this.currentTextbox.innerHTML = '|';
    this.updateStyle();
    this.manipulator.appendChild(this.subElement, this.currentTextbox);
    this.textBoxes.set(this.currentBoxNumber++, this.currentTextbox);
    this.clickPosition.setY(this.clickPosition.getY() + this.size.value  * CONSTANTS.TEXT_SPACING);
  }

  private createElement(): void {
    this.subElement = this.manipulator.createElement(SVGProperties.g, SVGProperties.nameSpace);

    this.createCurrentTextBox();

    this.manipulator.appendChild(this.image.nativeElement, this.subElement);
  }

  private updateStyle(): void {
    if(this.currentTextbox !== undefined) {
      this.manipulator.setAttribute(this.currentTextbox, SVGProperties.fontSize, this.size.value.toString());
      this.manipulator.setAttribute(this.currentTextbox, SVGProperties.font, this.font.value.toString());
      this.manipulator.setAttribute(this.currentTextbox, SVGProperties.fill, 
        this.colorSelectorService.primaryColor.value.getHex()
      );
      if(this.isItalic.value) {
        this.manipulator.setAttribute(this.currentTextbox, SVGProperties.fontStyle, 'italic');
      }
      if(this.isBold.value) {
        this.manipulator.setAttribute(this.currentTextbox, SVGProperties.fontWeight, 'bold');
      }
    }
  }
}