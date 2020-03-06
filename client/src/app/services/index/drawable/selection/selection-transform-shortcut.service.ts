import { Injectable, Renderer2 } from '@angular/core';
import { Transform } from 'src/app/classes/transformations';

@Injectable({
  providedIn: 'root'
})
export class SelectionTransformShortcutService {

  readonly firstDelay = 500;
  readonly moveDelay = 100;
  readonly unitMove = 3;

  readonly left = 'ArrowLeft';
  readonly down = 'ArrowDown';
  readonly right = 'ArrowRight';
  readonly up = 'ArrowUp';

  private lastKeyPressed: string;

  private leftArrowIsPressed: boolean;
  private rightArrowIsPressed: boolean;
  private upArrowIsPressed: boolean;
  private downArrowIsPressed: boolean;

  private isMoving: boolean;
  private hasWaitedHalfSec: boolean;

  private autoMoveHasInstance: boolean;

  private shortcutListener: (() => void)[] = [];

  constructor() { }

  setupShortcuts(manipulator: Renderer2): void {
    this.deleteShortcuts();
    this.shortcutListener.push(manipulator.listen(window, 'keydown', (event: KeyboardEvent) => {
      this.onKeyDown(event.key);
    }));
    this.shortcutListener.push(manipulator.listen(window, 'keyup', (event: KeyboardEvent) => {
      this.onKeyUp(event.key);
    }));
  }

  deleteShortcuts() {
    this.shortcutListener.forEach(listener => (listener()));
  }

  fct() {
    console.log(undefined === 'left');
  }

  private onKeyDown(keyPressed: string): void {
    switch (keyPressed) {
      case this.left:
        this.leftArrowIsPressed = true;
        if (this.lastKeyPressed !== keyPressed) {
          Transform.translate(-this.unitMove, 0);
        }
        break;
      case this.right:
        this.rightArrowIsPressed = true;
        if (this.lastKeyPressed !== keyPressed) {
          Transform.translate(this.unitMove, 0);
        }
        break;
      case this.up:
        this.upArrowIsPressed = true;
        if (this.lastKeyPressed !== keyPressed) {
          Transform.translate(0, -this.unitMove);
        }
        break;
      case this.down:
        this.downArrowIsPressed = true;
        if (this.lastKeyPressed !== keyPressed) {
          Transform.translate(0, this.unitMove);
        }
        break;
      default:
        break;
    }

    this.isMoving = true;
    if (!this.autoMoveHasInstance) {
      this.autoMoveHasInstance = true;
      this.autoMove();
    }

    this.lastKeyPressed = keyPressed;
  }

  private onKeyUp(keyReleased: string): void {
    switch (keyReleased) {
      case this.left:
        this.leftArrowIsPressed = false;
        break;
      case this.right:
        this.rightArrowIsPressed = false;
        break;
      case this.up:
        this.upArrowIsPressed = false;
        break;
      case this.down:
        this.downArrowIsPressed = false;
        break;
      default:
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
        setTimeout(() => this.autoMove(), this.moveDelay);
      } else {
        this.hasWaitedHalfSec = true;
        setTimeout(() => this.autoMove(), this.firstDelay);
      }
    } else {
      this.hasWaitedHalfSec = false;
      this.autoMoveHasInstance = false;
    }
  }

  private translate() {
    const translateX = (this.leftArrowIsPressed ? - this.unitMove : 0) + (this.rightArrowIsPressed ? this.unitMove : 0);
    const translateY = (this.upArrowIsPressed ? - this.unitMove : 0) + (this.downArrowIsPressed ? this.unitMove : 0);

    Transform.translate(translateX, translateY);
  }
}
