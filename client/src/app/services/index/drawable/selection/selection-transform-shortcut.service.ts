import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import * as CONSTANTS from 'src/app/classes/constants';
import { Transform } from 'src/app/classes/transformations';
import { DrawStackService } from 'src/app/services/draw-stack/draw-stack.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionTransformShortcutService {

  private lastKeyPressed: string;

  private leftArrowIsPressed: boolean;
  private rightArrowIsPressed: boolean;
  private upArrowIsPressed: boolean;
  private downArrowIsPressed: boolean;

  private manipulator: Renderer2;
  private image: ElementRef<SVGElement>;
  private drawStack: DrawStackService;
  private selectionGroup: SVGGElement;

  private isMoving: boolean;
  private hasWaitedHalfSec: boolean;

  private autoMoveHasInstance: boolean;

  private shortcutListener: (() => void)[] = [];

  setupShortcuts(manipulator: Renderer2, drawStack: DrawStackService, image: ElementRef<SVGElement>, selectionGroup: SVGGElement): void {
    this.deleteShortcuts();
    this.manipulator = manipulator;
    this.drawStack = drawStack;
    this.image = image;
    this.selectionGroup = selectionGroup;
    this.shortcutListener.push(manipulator.listen(window, 'keydown', (event: KeyboardEvent) => {
      this.onKeyDown(event.key);
    }));
    this.shortcutListener.push(manipulator.listen(window, 'keyup', (event: KeyboardEvent) => {
      this.onKeyUp(event.key);
    }));
  }

  deleteShortcuts(): void {
    this.shortcutListener.forEach((listener) => listener());
  }

  private onKeyDown(keyPressed: string): void {
    switch (keyPressed) {
      case CONSTANTS.LEFT:
        this.leftArrowIsPressed = true;
        if (this.lastKeyPressed !== keyPressed) {
          Transform.translate(-CONSTANTS.UNIT_MOVE, 0);
        }
        break;
      case CONSTANTS.RIGHT:
        this.rightArrowIsPressed = true;
        if (this.lastKeyPressed !== keyPressed) {
          Transform.translate(CONSTANTS.UNIT_MOVE, 0);
        }
        break;
      case CONSTANTS.UP:
        this.upArrowIsPressed = true;
        if (this.lastKeyPressed !== keyPressed) {
          Transform.translate(0, -CONSTANTS.UNIT_MOVE);
        }
        break;
      case CONSTANTS.DOWN:
        this.downArrowIsPressed = true;
        if (this.lastKeyPressed !== keyPressed) {
          Transform.translate(0, CONSTANTS.UNIT_MOVE);
        }
        break;
    }

    this.isMoving = true;
    const hasAKeyPressed = this.upArrowIsPressed || this.downArrowIsPressed || this.leftArrowIsPressed || this.rightArrowIsPressed;
    if (!this.autoMoveHasInstance && hasAKeyPressed) {
      this.autoMoveHasInstance = true;
      this.autoMove();
    }

    this.lastKeyPressed = keyPressed;
  }

  private onKeyUp(keyReleased: string): void {
    switch (keyReleased) {
      case CONSTANTS.LEFT:
        this.leftArrowIsPressed = false;
        break;
      case CONSTANTS.RIGHT:
        this.rightArrowIsPressed = false;
        break;
      case CONSTANTS.UP:
        this.upArrowIsPressed = false;
        break;
      case CONSTANTS.DOWN:
        this.downArrowIsPressed = false;
        break;
    }

    if (!this.leftArrowIsPressed && !this.rightArrowIsPressed && !this.upArrowIsPressed && !this.downArrowIsPressed) {
      this.isMoving = false;
    }

    this.lastKeyPressed = '';
  }

  private async autoMove(): Promise<void> {
    if (this.isMoving) {
      if (this.hasWaitedHalfSec) {
        this.translate();
        setTimeout(() => this.autoMove(), CONSTANTS.MOVE_DELAY);
      } else {
        this.hasWaitedHalfSec = true;
        setTimeout(() => this.autoMove(), CONSTANTS.FIRST_DELAY);
      }
    } else {
      this.hasWaitedHalfSec = false;
      this.autoMoveHasInstance = false;

      this.selectionGroup.remove();
      this.drawStack.addSVGWithNewElement(this.image.nativeElement.cloneNode(true) as SVGElement);
      this.manipulator.appendChild(this.image.nativeElement, this.selectionGroup);
    }
  }

  private translate(): void {
    const translateX = (this.leftArrowIsPressed ? - CONSTANTS.UNIT_MOVE : 0) + (this.rightArrowIsPressed ? CONSTANTS.UNIT_MOVE : 0);
    const translateY = (this.upArrowIsPressed ? - CONSTANTS.UNIT_MOVE : 0) + (this.downArrowIsPressed ? CONSTANTS.UNIT_MOVE : 0);

    Transform.translate(translateX, translateY);
  }
}
